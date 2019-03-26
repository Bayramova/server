const Sequelize = require("sequelize");
const db = require("../config/database");

const User = db.sequelize.define(
  "user",
  {
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    role: {
      type: Sequelize.ENUM("guest", "client", "company", "admin"),
      default: "guest"
    }
  },
  {
    timestamps: false
  }
);

module.exports = User;
