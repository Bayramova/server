// const { User } = require("../models/user");
const Client = require("../models/client");
const Company = require("../models/company");
const { Order } = require("../models/order");

// Feedback.findAll({
//   include: [
//     {
//       model: Order,
//       include: [
//         {
//           model: Company,
//           where: {
//             id: 25
//           }
//         }
//       ]
//     }
//   ]
// }).then(feedbacks =>
//   feedbacks.forEach(feed => {
//     const { rate, feedback, order } = feed.dataValues;
//     console.log("!!!", {
//       rate,
//       feedback,
//       order: order.dataValues
//     });
//   })
// );

Order.findOne({
  where: {
    id: 13
  },
  include: [
    { model: Company },
    {
      model: Client
    }
  ]
}).then(order => {
  console.log(order);
});

// User.findAll({ include: [Client] })
//   .then(users =>
//     users.forEach(user => {
//       const { id, email, client } = user.dataValues;
//       console.log({ id, email, client });
//     })
//   )
//   .catch(err => console.log(err));

// User.findAll({ include: Company })
//   .then(users =>
//     users.forEach(user => {
//       const { id, email, company } = user.dataValues;
//       console.log({ id, email, company: company.dataValues });
//     })
//   )
//   .catch(err => console.log(err));
