/* eslint-disable no-shadow */
/* eslint-disable consistent-return */

"use strict";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto-random-string");
const { User, VerificationToken } = require("../models/user");
const { CLIENT } = require("../models/user");
const Client = require("../models/client");
const Company = require("../models/company");
const jwtSecret = require("../config/keys");
const fileUpload = require("./fileUpload");
const sendMail = require("./sendMail");

const signUp = async (data, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: data.email
      }
    });
    if (user) {
      return res.status(400).json({ email: "Email already exists!" });
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(data.password, salt);
    if (data.role === CLIENT) {
      const newClient = await Client.create({
        name: data.name,
        address: data.address
      });
      if (newClient) {
        const newUser = await User.create({
          role: data.role,
          email: data.email,
          password: hash,
          client_id: newClient.id
        });
        if (newUser) {
          const verificationToken = await VerificationToken.create({
            user_id: newUser.id,
            token: crypto({ length: 10 })
          });
          if (verificationToken) {
            sendMail(newUser.email, verificationToken.token);
            return {
              message: "Email sent, please check your inbox to confirm",
              user: newUser,
              verificationToken: verificationToken.token
            };
          }
        }
      }
    } else {
      let logo;
      if (data.logo) {
        logo = await fileUpload(Date.now().toString(), data.logo, res);
      }
      const newCompany = await Company.create({
        logo,
        name: data.name,
        address: data.address,
        services: data.services
      });
      if (newCompany) {
        const newUser = await User.create({
          role: data.role,
          email: data.email,
          password: hash,
          company_id: newCompany.id
        });
        if (newUser) {
          const verificationToken = await VerificationToken.create({
            user_id: newUser.id,
            token: crypto({ length: 10 })
          });
          if (verificationToken) {
            sendMail(newUser.email, verificationToken.token);
            return {
              message: "Email sent, please check your inbox to confirm",
              user: newUser,
              verificationToken: verificationToken.token
            };
          }
        }
      }
    }
  } catch (error) {
    console.log(error);
    return res.json({ message: error.message });
  }
};

const verifyEmail = async (verificationToken, res) => {
  try {
    const token = await VerificationToken.findOne({
      where: { token: verificationToken },
      include: [User]
    });
    if (token) {
      const { user } = token.dataValues;
      if (user) {
        if (user.isEmailVerified) {
          return res.status(401).json({
            error: "Email already verified, please sign in."
          });
        }
        const updatedUser = await user.update({ isEmailVerified: true });
        if (updatedUser) {
          const payload = {
            id: updatedUser.id,
            exp: Math.floor(Date.now() / 1000) + 60 * 60
          };
          const token = jwt.sign(payload, jwtSecret.secret);

          const { id, email, role } = updatedUser.dataValues;

          return {
            success: true,
            token: `Bearer ${token}`,
            user: { id, email, role }
          };
        }
      } else {
        res.status(401).json({
          error: "Verification token is expired. Please push the resend button."
        });
      }
    }
  } catch (error) {
    console.error(error);
    return { error: "Verification failed." };
  }
};

const signIn = async (data, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: data.email
      }
    });
    if (!user) {
      return res.status(400).json({ emailincorrect: "No such user!" });
    }

    if (!user.isEmailVerified) {
      return res
        .status(400)
        .json({ emailincorrect: "Please confirm your email to login!" });
    }

    const match = await bcrypt.compare(data.password, user.password);
    if (!match) {
      return res.status(400).json({ passwordincorrect: "Incorrect password!" });
    }

    const payload = {
      id: user.id,
      exp: Math.floor(Date.now() / 1000) + 60 * 60
    };
    const token = jwt.sign(payload, jwtSecret.secret);

    const { id, email, role } = user.dataValues;

    return {
      success: true,
      token: `Bearer ${token}`,
      user: { id, email, role }
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Authentication failed." };
  }
};

const getUserFromToken = async data => {
  try {
    const user = await User.findOne({
      where: {
        id: data
      }
    });
    if (user) {
      const { id, email, role } = user.dataValues;
      return {
        user: { id, email, role }
      };
    }
  } catch (err) {
    console.log(err);
    return { success: false, message: "Authentication failed." };
  }
};

module.exports = { signUp, verifyEmail, signIn, getUserFromToken };
