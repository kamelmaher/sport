function getDate() {
    return {
      today: () => {
        const now = new Date();
        const date = now.toISOString().split('T')[0]; // Returns YYYY-MM-DD
        const [year, month, day] = date.split('-');
        
        return {
          en: {
            day,
            month,
            year
          }
        };
      }
    };
  }
  
  module.exports = { getDate };