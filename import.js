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

fs.readFile(DATA, (err, data) => {
  const records = JSON.parse(data);
  const columns = Object.keys(records[0]);
  db.sequelize
    .query(
      `SELECT COUNT(*) AS count
    FROM information_schema.tables 
    WHERE table_schema = 'cleaning-services' 
    AND table_name = '${TABLE_NAME}';`
    )
    .then(data => {
      if (data[0][0].count == 0) {
        db.sequelize.query(
          `CREATE TABLE ${TABLE_NAME} (${columns.join(
            " VARCHAR(300), "
          )} VARCHAR(300));`
        );
      } else {
        db.sequelize.query(`DELETE FROM ${TABLE_NAME}`);
      }
      records.forEach(record => {
        const values = Object.values(record);
        let valuesToInsert = '"' + values.join('", "') + '"';
        db.sequelize.query(
          `INSERT INTO ${TABLE_NAME} VALUES (${valuesToInsert});`
        );
      });
    });
});
