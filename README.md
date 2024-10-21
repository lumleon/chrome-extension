# chrome-extension
Creating a Chrome extension that listens in real-time to HTTP responses and saves them to an MSSQL server involves several steps. Here's a high-level overview and a basic implementation guide:
#Overview
1. Manifest File: Define the extension's permissions and background scripts.
2. Background Script: Use the chrome.webRequest API to listen for HTTP responses.
3. Data Handling: Send the captured data to a server-side API that interacts with the MSSQL database.
4. Server-Side API: Create a Node.js (or similar) server that connects to the MSSQL database and saves the data.

# Create the Server-Side API
You can use Node.js with the mssql package to connect to your MSSQL database.

  Set up your Node.js environment:
  bash

 
  mkdir http-response-listener-server
  cd http-response-listener-server
  npm init -y
  npm install express body-parser mssql
  
  ## Create the server code: Create a file named server.js:
  
      const express = require('express');
      const bodyParser = require('body-parser');
      const sql = require('mssql');
      
      const app = express();
      app.use(bodyParser.json());
      
      // MSSQL configuration
      const config = {
        user: 'your_username',
        password: 'your_password',
        server: 'your_server', // e.g., 'localhost'
        database: 'your_database',
        options: {
          encrypt: true, // Use this if you're on Azure
          trustServerCertificate: true // Change to true for local dev / self-signed certs
        }
      };
      
      sql.connect(config).then(pool => {
        if (pool.connected) {
          console.log('Connected to MSSQL');
        }
      
      app.post('/save', async (req, res) => {
          const { url, statusCode, responseHeaders, timestamp } = req.body;
      
          try {
            await pool.request()
              .input('url', sql.VarChar, url)
              .input('statusCode', sql.Int, statusCode)
              .input('responseHeaders', sql.NVarChar, JSON.stringify(responseHeaders))
              .input('timestamp', sql.DateTime, timestamp)
              .query('INSERT INTO HttpResponseLogs (url, statusCode, responseHeaders, timestamp) VALUES (@url, @statusCode, 
                    @responseHeaders, @timestamp)');
      
            res.status(200).send('Data saved successfully');
          } catch (error) {
            console.error('Error saving data:', error);
            res.status(500).send('Error saving data');
          }
        });
      }).catch(err => {
        console.error('SQL connection error:', err);
      });
      
      app.listen(3000, () => {
        console.log('Server is running on port 3000');
      });

#   Run the Server
Run your server with:

    bash
    node server.js
  
# Final Steps
Load the extension: Go to chrome://extensions/, enable "Developer mode", and load your unpacked extension.
Test: Open a new tab and perform some HTTP requests to see if the data gets logged in your MSSQL database.

# Security Considerations
Ensure proper validation and sanitation of incoming data.
Use HTTPS for secure communication between the extension and server.
Implement authentication for your server API to prevent unauthorized access.

# Conclusion
This guide provides a foundational setup for a Chrome extension that listens for HTTP responses and saves them to an MSSQL server. You can expand upon this by adding error handling, user interfaces, and additional features as necessary.
