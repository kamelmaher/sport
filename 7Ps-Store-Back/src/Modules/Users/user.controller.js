

const User = require('./user.model');
const jwt = require('jsonwebtoken');


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.status(404).json({ error: 'No users found' });
    }

    res.status(200).json({
      count: users.length,
      users
    });
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
    const { userName, phone } = req.body;

    if (!userName || !phone) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(409).json({ error: 'phone already registered' });
    }

    // create a new user
    const newUser = new User({
      userName,
      phone,
      role: 'user',
      status: 'approved'
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
    const { id } = req.params;
    const updates = req.body;

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    const restrictedFields = ['_id', 'createdAt', 'updatedAt', 'role'];
    restrictedFields.forEach(field => {
      if (updates[field]) {
        return res.status(400).json({
          error: `Cannot update restricted field: ${field}`
        });
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    const userToReturn = updatedUser.toObject();
    delete userToReturn.__v;

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: userToReturn
    });

  } catch (error) {
    console.error('Update user error:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }

    res.status(500).json({
      error: 'Server error',
      message: error.message
    });
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
    const userName = req.body.userName?.trim();
    const phone = req.body.phone?.trim();

    console.log('Received userName:', userName);
    console.log('Received phone:', phone);

    if (!userName || !phone) {
      return res.status(400).json({ error: 'User name and Phone number are required' });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      const newUser = new User({
        userName: userName,
        phone: phone,
        role: 'user',
        status: 'pending',
      });

      await newUser.save();
      return res.status(200).json({ message: 'User registered successfully', status: 'pending', role: 'user' });
    }

    if (userName.localeCompare(user.userName, undefined, { sensitivity: 'base' }) !== 0) {
      return res.status(401).json({ error: 'User names Don`t match' });
    }

    if (user.status === 'pending') {
      return res.status(200).json({ error: 'User is pending', status: user.status });
    }

    const token = jwt.sign(
      {
        _id: user._id,
        role: user.role,
        phone: user.phone,
        userName: user.userName
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        algorithm: 'HS256'
      }
    );

    res.status(200).json({
      token,
      user: user.userName,
      role: user.role,
      status: user.status,
      message: 'User logged in successfully'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
};

const GetAllPindingUsers = async (req, res) => {
  try {
    const users = await User.find({ status: 'pending', role: 'user' });
    if (!users) {
      return res.status(404).json({ error: 'No users found' });
    }
    res.status(200).json({
      users: users,
      count: users.length
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  login,
  GetAllPindingUsers
};