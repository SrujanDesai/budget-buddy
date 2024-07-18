const bcrypt = require("bcrypt");

// To hash the password using bcrypt library
const hashPassword = async (password) => {
  try {
    // Creating salt rounds and hashing the password
    const salt = 10;
    const hashedPassword = await bcrypt.hash(password, salt);

    // Return the hashed password
    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
};

// It will compare the user insert password with the hashed password
const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

//Exports
module.exports = { hashPassword, comparePassword };
