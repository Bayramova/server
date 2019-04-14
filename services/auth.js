/* eslint-disable consistent-return */

"use strict";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user");
const { CLIENT } = require("../models/user");
const Client = require("../models/client");
const Company = require("../models/company");
const jwtSecret = require("../config/keys");

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

    const newUser = User.build({
      role: data.role,
      name: data.name,
      email: data.email,
      password: data.password
    });

    if (data.role === CLIENT) {
      const newClient = await Client.create({
        name: data.name,
        address: data.address
      });
      if (newClient) {
        newUser.client_id = newClient.id;
      }
    } else {
      const newCompany = await Company.create({
        logo: data.logo,
        name: data.name,
        address: data.address,
        services: data.services
      });
      if (newCompany) {
        newUser.company_id = newCompany.id;
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newUser.password, salt);
    newUser.password = hash;
    const registeredUser = newUser.save();
    if (registeredUser) {
      return registeredUser;
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: "Registration failed." };
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

module.exports = { signUp, signIn, getUserFromToken };
