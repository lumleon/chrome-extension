# chrome-extension
Creating a Chrome extension that listens in real-time to HTTP responses and saves them to an MSSQL server involves several steps. Here's a high-level overview and a basic implementation guide:
#Overview
1. Manifest File: Define the extension's permissions and background scripts.
2. Background Script: Use the chrome.webRequest API to listen for HTTP responses.
3. Data Handling: Send the captured data to a server-side API that interacts with the MSSQL database.
4. Server-Side API: Create a Node.js (or similar) server that connects to the MSSQL database and saves the data.
