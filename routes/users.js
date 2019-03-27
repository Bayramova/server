"use strict";

/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
const express = require("express");

const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Company = require("../models/company");
const jwtSecret = require("../config/keys");

router.post("/signup", (req, res) => {
  if (req.body.role === "client") {
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (user) {
        return res.status(400).json({ email: "Email already exists!" });
      }
      const newUser = { ...req.body };

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
  } else {
    Company.findOne({
      where: {
        email: req.body.email
      }
    }).then(company => {
      console.log(`name ${req.body.name}`);
      if (company) {
        return res.status(400).json({ email: "Email already exists!" });
      }
      const newCompany = {
        ...req.body,
        id: req.body.name
          .split(" ")
          .join("")
          .toLowerCase()
      };

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newCompany.password, salt, (err, hash) => {
          if (err) throw err;
          newCompany.password = hash;
          return Company.create(newCompany)
            .then(company => {
              res.json(company);
            })
            .catch(err => console.log(err));
        });
      });
    });
  }
});

router.post("/signin", (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(user => {
    if (!user) {
      return res.status(400).json({ emailincorrect: "No such user!" });
    }

    bcrypt.compare(req.body.password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = {
          id: user.id,
          email: user.email,
          role: user.role
        };

        jwt.sign(
          payload,
          jwtSecret.secret,
          {
            expiresIn: 10
          },
          (err, token) => {
            res.json({
              success: true,
              token: `Bearer ${token}`
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect!" });
      }
    });
  });
});

module.exports = router;
