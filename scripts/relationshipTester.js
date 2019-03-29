const Company = require("../models/company");
const User = require("../models/user");

Company.create({
  role: "company",
  email: "freeshperspectives@gmail.com",
  password: "$2y$10$kvezqQTPf5PSR7ZAaBsXhupEt5iVE9/CLLkgxjh9eIME/ptkGKskC",
  logo: "./img/logo/atom-solid.svg",
  name: "Fresh Perspectives",
  address: "1600 Pennsylvania Avenue, Washington",
  rating: "4",
  orders: "50",
  services: ["standardcleaning", "generalcleaning", "repaircleaning"],
  reviewsNumber: "25"
})
  .then(newCompany => {
    console.log(newCompany.get());
  })
  .catch(err => {
    console.log("Error while company creation : ", err);
  });

User.bulkCreate([
  {
    email: "john-connor@gmail.com",
    password: "$2y$10$kvezqQTPf5PSR7ZAaBsXhupEt5iVE9/CLLkgxjh9eIME/ptkGKskC",
    name: "John",
    address: "1600 Pennsylvania Avenue, Washington",
    companyId: 1
  },
  {
    email: "john-connor1@gmail.com",
    password: "$2y$10$kvezqQTPf5PSR7ZAaBsXhupEt5iVE9/CLLkgxjh9eIME/ptkGKskC",
    name: "John",
    address: "1600 Pennsylvania Avenue, Washington",
    companyId: 1
  },
  {
    email: "john-connor2@gmail.com",
    password: "$2y$10$kvezqQTPf5PSR7ZAaBsXhupEt5iVE9/CLLkgxjh9eIME/ptkGKskC",
    name: "John",
    address: "1600 Pennsylvania Avenue, Washington",
    companyId: 1
  }
])
  .then(newUsers => {
    console.log(newUsers);
  })
  .catch(err => {
    console.log("Error while users creation : ", err);
  });

User.findOne({
  where: { email: "john-connor@gmail.com" },
  include: [{ model: Company, as: "company" }]
})
  .then(findedUser => {
    console.log(findedUser.company);
  })
  .catch(err => {
    console.log("Error while find user : ", err);
  });

Company.findByPk(1, { include: [{ model: User, as: "employees" }] })
  .then(company => {
    console.log(company.employees);
  })
  .catch(err => {
    console.log("Error while find company : ", err);
  });
