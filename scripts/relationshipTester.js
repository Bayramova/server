const User = require("../models/user");
const Client = require("../models/client");
const Company = require("../models/company");

User.findAll({ include: Client })
  .then(users =>
    users.forEach(user => {
      const { id, email, client } = user.dataValues;
      console.log({ id, email, client: client.dataValues });
    })
  )
  .catch(err => console.log(err));

User.findAll({ include: Company })
  .then(users =>
    users.forEach(user => {
      const { id, email, company } = user.dataValues;
      console.log({ id, email, company: company.dataValues });
    })
  )
  .catch(err => console.log(err));
