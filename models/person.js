import db from "./db_handler.js";

function getAll(callback) {
  let sql = `select * from person`;
  db(sql, [], callback);
}

export default getAll;
