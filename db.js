const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root', // Your MySQL username
    password: 'Brianazangu959$', // Your MySQL password
    database: 'telemedicine_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();