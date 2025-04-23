

const User = require('./user.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { client, connectRedis} = require('../../../DB/redisClient');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword, // store the hashed password
    });

    // save the new user
    await newUser.save();

    // register user successfully
    res.status(201).json({ message: 'User registered successfully' });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
};


const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


/**
 * Login a user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @returns {Promise<void>}
 * @throws {Error} If the user is not found or the password is incorrect
 */
const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      console.log('email:', email);
      console.log('password:', password);
      if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });
      // 1. Check if user exists
      const user = await User.findOne({ email });
      console.log('user:', user);

      if (!user) return res.status(401).json({ error: 'Invalid email or password' });
      
      // 2. Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });
  
      // 3. Generate JWT
      const token = jwt.sign(
        { 
          _id: user._id, 
          role: user.role,
          email: user.email
        },
        process.env.JWT_SECRET,
        { 
          expiresIn: process.env.JWT_EXPIRES_IN || '2d',
          algorithm: 'HS256'
        }
      );

    // const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      console.log('token:', token);
      
      await connectRedis();
      const expiresInSeconds = 2 * 24 * 60 * 60; // 2 days
      console.log('user id:', user?._id);
      console.log('expiresInSeconds:', expiresInSeconds);
      await client.set(token, user._id.toString());
      await client.expire(token, expiresInSeconds);

      res.status(200).json({ token, user: { username: `${user.firstName} ${user.lastName}`, email: user.email } });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

const logout = async (req, res)=>{
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(400).json({ error: 'Token missing' });
        // Delete the token from Redis
        await client.del(token);
        res.status(200).json({ message: 'Logged out successfully' });
    }catch(error){
        res.status(500).json({ error: error.message });
    }

}


const promoteUserToAdmin = async (req, res) => {
      try {
        // 1. Validate request parameters
        if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
          return res.status(400).json({ error: 'Invalid user ID format' });
        }
  
        // 2. Check if user exists and isn't already admin
        const targetUser = await User.findById(req.params.id);
        if (!targetUser) {
          return res.status(404).json({ error: 'User not found' });
        }
        if (targetUser.role === 'admin') {
          return res.status(400).json({ error: 'User is already an admin' });
        }
  
        // 3. Prevent self-demotion protection
        if (targetUser._id.toString() === req.user._id.toString()) {
          return res.status(403).json({ error: 'Cannot modify your own admin status' });
        }
  
        // 4. Update user role
        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          { role: 'admin' },
          { new: true, runValidators: true }
        ).select('-password'); // Exclude password from response
  
  
        // 5. Log the action
        console.log(`Admin promotion by ${req.user.email} for user ${targetUser.email}`);
  
        res.status(200).json({ 
          success: true,
          message: 'User promoted to admin successfully',
          user: updatedUser 
        });
  
      } catch (error) {
        console.error('Admin promotion error:', error);
        
        if (error.name === 'CastError') {
          return res.status(400).json({ error: 'Invalid user ID' });
        }
        
        res.status(500).json({ 
          error: 'Internal server error',
          details: error.message 
        });
      }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    login,
    logout,
    promoteUserToAdmin
};