import sql from "mysql2";

let connectionDetails = {
  host: "localhost",
  user: "root",
  password: "My$ql@wb",
  database: "person",
};

function getConnection() {
  return sql.createConnection(connectionDetails);
}

function executeQuery(query, parameters, callback) {
  let connection = getConnection();
  connection.connect((err) => {
    if (!err) {
      console.log("db connection success");
    } else {
      console.log("db connection failed" + JSON.stringify(err, undefined, 2));
    }
  });
  connection.query(query, parameters, callback, (err, result, fields) => {
    if (err) {
      console.log(err);
    }
  });
  connection.commit();
  connection.end();
}

export default executeQuery;
