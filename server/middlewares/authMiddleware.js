const JWT = require("jsonwebtoken");

// Middlewares for Protecting Routes
const signInRequired = async (req, res, next) => {
  try {
    // To verify the token
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET_KEY
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};

// Exports
module.exports = { signInRequired };
