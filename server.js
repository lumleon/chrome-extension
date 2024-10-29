require('dotenv').config();
const express = require('express');
const sql = require('mssql');
const helmet = require('helmet'); // For security enhancements

const app = express();
const port = process.env.PORT || 3000;

// Use Helmet for basic security
app.use(helmet());

// Configure your database connection using environment variables
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true, // Use encryption
    trustServerCertificate: false // Change to true only if necessary
  }
};

// Middleware to parse JSON requests
app.use(express.json());

app.post('/saveData', async (req, res) => {
  try {
    await sql.connect(dbConfig);
    const { queryName, data } = req.body;

    // Example query to insert data into a table
    const query = `INSERT INTO yourTable (queryName, data) VALUES (@queryName, @data)`;

    const request = new sql.Request();
    request.input('queryName', sql.VarChar, queryName);
    request.input('data', sql.Text, JSON.stringify(data));

    await request.query(query);
    res.status(200).send('Data saved successfully');
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).send('Error saving data');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});