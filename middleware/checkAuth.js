/* eslint-disable consistent-return */
const jwtDecode = require("jwt-decode");

module.exports = (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    const decoded = jwtDecode(token).id;
    req.id = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Auth failed"
    });
  }
};
