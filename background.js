const BASE_URL = "https://spacex-production.up.railway.app/";

function saveDataToMSSQL(queryName, data) {
    fetch('http://localhost:3000/saveData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ queryName, data })
    })
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.error('Error:', error));
  }
  
  function fetchGraphQL(query, queryName) {
    return fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        saveDataToMSSQL(queryName, data);
      })
      .catch(error => console.error(error));
  }
  
  // Modify fetchShips and fetchDragons to pass queryName
  function fetchShips() {
    const shipsQuery = `
      query Ships {
        ships {
          id
          model
          name
          type
          status
        }
      }
    `;
    fetchGraphQL(shipsQuery, 'Ships');
  }
  
  function fetchDragons() {
    const dragonsQuery = `
      query Dragons {
        dragons {
          name
          first_flight
          diameter {
            feet
          }
          launch_payload_mass {
            lb
          }
        }
      }
    `;
    fetchGraphQL(dragonsQuery, 'Dragons');
  }


chrome.alarms.create("fetchShips", { periodInMinutes: 5 });
chrome.alarms.create("fetchDragons", { periodInMinutes: 60 });

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === "fetchShips") {
    fetchShips();
  } else if (alarm.name === "fetchDragons") {
    fetchDragons();
  }
});