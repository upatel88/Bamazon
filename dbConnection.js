module.exports = {
 sql_connection: null,
 connect: function() {
	var mysql = require("mysql");
   return mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "bamazon"
});
}};

