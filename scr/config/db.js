const mysql = require("mysql2/promise");

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: 3306,
    connectionLimit: 100,
    namedPlaceholders: true
});
// db.connect(function (err) {
//     if (err) throw err;
//     console.log('Database is connected successfully!')
// });

module.exports = db;
