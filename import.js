const fs = require("fs");
const path = require("path");
const db = require("./database/db");

let TABLE_NAME = "";
let FILE_NAME = "";

process.argv.forEach(element => {
  const line = element.split("=");
  if (line[0] && line[0].trim() == "--table") {
    TABLE_NAME = line[1] ? line[1].trim() : "invalid";
  }
  if (line[0] && line[0].trim() == "--filename") {
    FILE_NAME = line[1] ? line[1].trim() : "invalid";
  }
});
const DATA = path.join(__dirname, `./data/${FILE_NAME}`);

let table_exists = false;
db.sequelize
  .query(
    `SELECT * FROM information_schema.TABLES WHERE TABLE_SCHEMA = 'cleaning-services' AND TABLE_NAME = '${TABLE_NAME}';`
  )
  .then(([results, metadata]) => {
    console.log(results);
    if (results) {
      table_exists = true;
      db.sequelize.query(`DELETE FROM ${TABLE_NAME}`);
    }
  });

console.log("Table existsts?????????" + table_exists);

fs.readFile(DATA, (err, data) => {
  const records = JSON.parse(data);
  const columns = Object.keys(records[0]);
  let data_length = records.length;

  //   if (!table_exists) {
  //     db.sequelize.query(
  //       `CREATE TABLE ${TABLE_NAME} (${columns.join(" TEXT, ")} TEXT);`
  //     );
  //   }

  records.forEach(record => {
    const values = Object.values(record);
    let valuesToInsert = '"' + values.join('", "') + '"';
    db.sequelize.query(`INSERT INTO ${TABLE_NAME} VALUES (${valuesToInsert});`);
    data_length = data_length - 1;
    console.log(`Importing... (${data_length}) Record(s)`);
    console.clear();
    if (!data_length) {
      console.log(`Done importing (${records.length}) Records`);
      process.exit();
    }
  });
});
