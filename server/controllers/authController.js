const User = require("../models/User");
const Role = require("../models/Role");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

// const secretKey = config.get("secretKey") || process.env.SECRET_KEY;
const secretKey = process.env.SECRET_KEY;

class AuthController {
  async registration(req, res) {
    console.log("req.body", req.body);
    // try {
    //   const errors = validationResult(req);
    //   if (!errors.isEmpty()) {
    //     return res.status(400).json({
    //       errors: errors.array(),
    //       message: "uncorrect request",
    //     });
    //   }
    //   const { firstName, lastName, email, password } = req.body;
    //   const candidate = await User.findOne({ email });

    //   if (candidate) {
    //     return res
    //       .status(400)
    //       .json({ message: `User with email ${email} already exist` });
    //   }
    //   const hashPassword = bcrypt.hashSync(password, 8);
    //   const userRole = await Role.findOne({ value: "User" });
    //   const created = new Date();
    //   const user = new User({
    //     firstName,
    //     lastName,
    //     email,
    //     password: hashPassword,
    //     created,
    //     roles: [userRole.value],
    //   });
    //   await user.save();
    //   return res.status(201).json({ message: "new user created", user });
    // } catch (e) {
    //   console.log(e);
    //   res.status(400).json({ message: e.message });
    // }
  }

  async login(req, res) {
    try {
      // console.log("from login");
      // console.log("req.body:", req.body);
      const { username, password } = req.body;
      const user = await User.findOne({ username });

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      const isPassValid = bcrypt.compareSync(password, user.password);

      if (!isPassValid) {
        return res.status(400).json({ message: "incorrect password or email" });
      }

      const token = jwt.sign({ id: user._id, roles: user.roles }, secretKey, {
        expiresIn: "1200s",
      });
      return res.json({
        token,
        user: {
          id: user._id,
          username: user.username,
          roles: user.roles,
          avatar: user.avatar,
        },
      });
    } catch (e) {
      console.log(e);
      //res.send({message: "Server error"})
      res.status(500).json({ message: e.message });
    }
  }

  async auth(req, res) {
    try {
      const user = await User.findOne({ _id: req.user.id });
      const token = jwt.sign({ id: user.id }, secretKey, {
        expiresIn: "1200s",
      });
      return res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          avatar: user.avatar,
        },
      });
    } catch (e) {
      console.log(e);
      res.send({ message: e.message });
    }
  }
}

module.exports = new AuthController();
