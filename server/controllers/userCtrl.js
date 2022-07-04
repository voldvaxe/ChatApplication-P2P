const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

const userCtrl = {
  register: async (req, res) => {
    try {
      const { firstName, lastName, email, password } = req.body;
      const image = req.file.filename;

      if (!firstName || !lastName || !email || !password || !image)
        return res.status(400).json({ msg: "some parameters are missing" });

      const emailExists = await User.findOne({ email });

      if (emailExists)
        return res.status(400).json({ msg: "this email already exists" });

      if (password.length < 6)
        return res.status(400).json({ msg: "this password is too short" });

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        image,
      });

      await newUser.save();

      const accesstoken = createAccessToken({
        id: newUser._id,
      });
      const refreshtoken = createRefreshToken({
        id: newUser._id,
      });

      res.cookie("refreshToken", refreshtoken, {
        httpOnly: true,
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ accesstoken });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password)
        return res.status(400).json({ msg: "some parameters are missing" });
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: "email is not exist" });

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch)
        return res.status(400).json({ msg: "this is a wrong password" });

      const accesstoken = createAccessToken({
        id: user._id,
      });
      const refreshtoken = createRefreshToken({
        id: user._id,
      });

      res.cookie("refreshToken", refreshtoken, {
        httpOnly: true,
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.json({ accesstoken });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshToken", { path: "/" });
      return res.json({ msg: "logged out" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  refreshToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshToken;
      if (!rf_token)
        return res.status(400).json({ msg: "please login or register1" });

      jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err)
          return res.status(400).json({ msg: "Please Login or Register2" });

        const accesstoken = createAccessToken({ id: user.id });
        res.json({ accesstoken });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getInfo: async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.user.id }).select("-password");
      res.json(user);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "7d" });
};

const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};

module.exports = userCtrl;
