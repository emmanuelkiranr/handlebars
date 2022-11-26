import db from "./db_handler";

function getAll(callback) {
  let sql = `select * from person`;
  db.executeQuery(sql, [], callback);
}

export default getAll;
