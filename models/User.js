const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },

}, { timestamps: true })

// Hash password before saving
userSchema.pre('save', async function (next) {
    try {
      // Only hash the password if it has been modified (or is new)
      if (!this.isModified('password')) {
        return next();
      }
  
      // Hash the password with a salt factor of 10
      const hashedPassword = await bcrypt.hash(this.password, 10);
      this.password = hashedPassword;
  
      next(); // Proceed with saving
    } catch (error) {
      next(error); // Pass any error to the next middleware
    }
  });
  
  // Compare password
  userSchema.methods.comparePassword = async function (inputPassword) {
    // Compare the input password with the stored hashed password
    const isMatch = await bcrypt.compare(inputPassword, this.password);
    return isMatch; // Return the comparison result
  };
  
module.exports = mongoose.model('User', userSchema)