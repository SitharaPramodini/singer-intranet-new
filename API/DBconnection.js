// dbconnection.js
const mysql = require('mysql2');

// Create a connection pool for better performance
const pool = mysql.createPool({
  host: 'payslip.lk',       // your database host
  user: 'SITHARA',   // your MySQL username
  password: 'Thara@#2024', // your MySQL password
  database: 'singer_intranet',        // your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
DB_USER=
DB_PASSWORD=''

// Export the pool for use in other files
module.exports = pool.promise();
