chrome.webRequest.onCompleted.addListener(
  function(details) {
    // Prepare the data to be sent to the server
    const data = {
      url: details.url,
      statusCode: details.statusCode,
      responseHeaders: details.responseHeaders,
      timestamp: new Date().toISOString()
    };

    // Send data to the server
    fetch('http://your-server-endpoint/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (!response.ok) {
        //TODO: send mqtt message alert
        console.error('Failed to save data:', response.statusText);
      }
    })
    .catch(error => {
      console.error('Error sending data:', error);
    });
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);
