const Router = require("express");
const User = require("../models/User");
const Role = require("../models/Role");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const authMiddleware = require("./../middleware/authMiddleware"); //добавить 2м параметром к app.get("/users", authMiddleware, controller.getUsers)
const AuthController = require("../controllers/authController");

const router = new Router();
// const secretKey = config.get("secretKey") || process.env.SECRET_KEY;
const secretKey = process.env.SECRET_KEY;

router.post(
  "/registration",
  [
    check("email", "Uncorrect email").isEmail(),
    check("username", "Username field should not be empty").notEmpty(),
    check(
      "password",
      "Password must be longer than 6 and shorter than 12"
    ).isLength({
      min: 6,
      max: 12,
    }),
  ],
  AuthController.registration
);

router.post("/login", AuthController.login);

router.get("/auth", authMiddleware, AuthController.auth);

module.exports = router;
