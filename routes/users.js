/* eslint-disable consistent-return */
/* eslint-disable no-console */
/* eslint-disable no-shadow */
const express = require("express");

const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/database");
const User = require("../models/user");
const jwtSecret = require("../config/keys");

router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.json({ message: "Email already exists" });
    }

    db.sequelize.sync().then(() => {
      const newUser = {
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
      };

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          return User.create(newUser)
            .then(user => {
              res.json(user);
            })
            .catch(err => console.log(err));
        });
      });
    });
  });
});

router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (!user) {
      return res.json({ message: "User not found" });
    }

    bcrypt.compare(req.body.password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = {
          id: user.id,
          email: user.email
        };

        jwt.sign(
          payload,
          jwtSecret.secret,
          {
            expiresIn: 31556926
          },
          (err, token) => {
            res.json({
              success: true,
              token: `Bearer ${token}`
            });
          }
        );
      } else {
        return res.json({ message: "Incorrect password." });
      }
    });
  });
});

module.exports = router;
