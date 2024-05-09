/** Database config for database. */


// const { Client } = require("pg");
// const {DB_URI} = require("./config");

// let db = new Client({
//   connectionString: DB_URI
// });

// db.connect();


// module.exports = db;

const  { Client } = require("pg");

let DB_URI;

if(process.env.NODE_ENV === "test") {
    DB_URI = "express_bookstore_test";
} else {
    DB_URI = "express_bookstore"
}

const db = new Client({
    host: "/var/run/postgresql",
    database: DB_URI })

db.connect();

module.exports = db;
