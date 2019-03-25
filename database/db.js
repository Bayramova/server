const Sequelize = require("sequelize");
const db = {};
// todo можно вынести параметры базы, такие как пользователь, пароль, host в .env файл https://www.npmjs.com/package/dotenv
const sequelize = new Sequelize("cleaning-services", "root", "8732586", {
  host: "127.0.0.1",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

db.sequelize = sequelize;

sequelize.authenticate()
.then(()=> console.log('Database connected'))
.catch(err => console.log(`Error: ${err}`));

module.exports = db;
