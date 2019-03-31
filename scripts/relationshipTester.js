// const Company = require("../models/company");
const Client = require("../models/client");
const User = require("../models/user");

const eagerLoading2 = () =>
  User.findAll({
    include: {
      model: Client
    }
  }).then(users => users.forEach(user => console.log(JSON.stringify(user))));

eagerLoading2();
