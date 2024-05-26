const jwt = require("jsonwebtoken");
const config = require("config");

// const secretKey = config.get("secretKey") || process.env.SECRET_KEY ;
const secretKey = process.env.SECRET_KEY;

module.exports = function (req, res, next) {
  if (req.method === "OPTIONS") {
    next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Auth error" });
    }
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err)
        return res
          .status(403)
          .json({ success: false, message: "jwt verify error" });
      req.user = decoded;
      console.log("DECODED!", decoded);
      next();
    });
  } catch (e) {
    console.log(e);
    return res.status(403).json({ message: "User not authorized" });
  }
};
