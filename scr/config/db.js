// const mysql = require("mysql2/promise");

// const db = mysql.createPool({
//     host:"premium208.web-hosting.com",
//     user:"sammzmxj_tsnhdb",
//     password:"EHSG%HhMSTlt",
//     database:"sammzmxj_tsnhdb",
//     // port:2083,
//     connectionLimit:100,
//     namedPlaceholders:true


// });
// db.connect(function(err){
//     if(err)throw err;
//     console.log('Database is connected successfully!')
// });

// module.exports = db;




const mysql = require("mysql2/promise");

const db = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"",
    database:"tsnh_db",
    //  port:3306,
    connectionLimit:100,
    namedPlaceholders:true


})

module.exports = db;