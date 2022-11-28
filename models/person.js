import db from "./db_handler.js";

function getAll(callback) {
  let sql = `select * from person`;
  db(sql, [], callback);
}

function addOne(data, callback) {
  let sql = `insert into person(p_id,p_name,p_age,p_email,p_country) values(?,?,?,?,?)`;
  let values = [
    data.p_id,
    data.p_name,
    data.p_age,
    data.p_email,
    data.p_country,
  ];
  db(sql, values, callback);
}
export default { getAll, addOne };
