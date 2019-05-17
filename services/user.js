/* eslint-disable eqeqeq */
/* eslint-disable consistent-return */

"use strict";

const crypto = require("crypto-random-string");
const { User, VerificationToken } = require("../models/user");
const { CLIENT } = require("../models/user");
const Client = require("../models/client");
const Company = require("../models/company");
const sendMail = require("./sendMail");

const getUserData = async id => {
  try {
    const user = await User.findOne({
      where: {
        id
      }
    });
    if (user) {
      if (user.role === CLIENT) {
        const userData = await Client.findOne({
          where: {
            id: user.client_id
          }
        });
        return {
          userData
        };
      }
      const userData = await Company.findOne({
        where: {
          id: user.company_id
        }
      });
      return {
        userData
      };
    }
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong." };
  }
};

const editUserData = async (id, data, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: data.email
      }
    });
    if (user && user.id != id) {
      return res.status(400).json({ email: "Email already exists!" });
    }

    const userToUpdate = await User.findOne({
      where: {
        id
      }
    });
    if (userToUpdate) {
      userToUpdate.email = data.email;
      userToUpdate.isEmailVerified = false;
      const updatedUser = await userToUpdate.save();
      if (updatedUser) {
        const verificationToken = await VerificationToken.create({
          user_id: updatedUser.id,
          token: crypto({ length: 10 })
        });
        if (verificationToken) {
          sendMail(updatedUser.email, verificationToken.token);
        }
        if (updatedUser.role === CLIENT) {
          const clientToUpdate = await Client.findOne({
            where: {
              id: updatedUser.client_id
            }
          });
          if (clientToUpdate) {
            clientToUpdate.name = data.name;
            clientToUpdate.address = data.address;
            await clientToUpdate.save();
            return {
              message: "Please check your inbox to confirm updating.",
              verificationToken: verificationToken.token
            };
          }
        }
        const companyToUpdate = await Company.findOne({
          where: {
            id: updatedUser.company_id
          }
        });
        if (companyToUpdate) {
          companyToUpdate.name = data.name;
          companyToUpdate.address = data.address;
          companyToUpdate.services = data.services;
          await companyToUpdate.save();
          return {
            message: "Please check your inbox to confirm updating.",
            verificationToken: verificationToken.token
          };
        }
      }
    }
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong." };
  }
};

module.exports = { getUserData, editUserData };
