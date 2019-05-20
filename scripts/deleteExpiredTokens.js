const Sequelize = require("sequelize");
const { VerificationToken } = require("../models/user");

setTimeout(() => {
  VerificationToken.destroy({
    where: {
      createdAt: {
        [Sequelize.Op.lt]: Date.now() - 60000
      }
    }
  }).then(() => {
    console.log("Expired tokens deleted.");
  });
}, 1000);
