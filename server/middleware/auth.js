const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    var token = req.header("Authorization");
    token = token.split(" ")[1];
    if (!token) return res.status(400).json({ msg: "invalid Authentication1" });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(400).json({ msg: "invalid Authentication2" });
      req.user = user;
      next();
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = auth;
