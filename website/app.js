// For security reasons, the API call to OpenWeatherMap is done through
// the backend of this application, so the API key is not exposed to the
// client. Therefore, the API key is included in `server.js` and not here.

// Retrieves the journal entry from the server. Returns the journal
// data or {error: error} if an error occurred.
async function retrieveJournalGET() {
  const response = await fetch("/api/currentJournal", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  try {
    const newData = await response.json();
    // console.log("Current Journal:", newData);
    return newData;
  } catch (error) {
    // console.log("error", error);
    return { error: error };
  }
}

// Saves the journal entry to the server after enriching it with
// weather data. Returns the journal data or {error: error} if an
// error occurred.
async function saveJournal(locationData, journalContent) {
  return retrieveWeatherPOST(locationData).then((weatherData) => {
    return addJournalPOST(weatherData, journalContent);
  });
}

// Saves the enriched journal entry to the server. Returns the journal
// data or {error: error} if an error occurred.
async function addJournalPOST(weatherData, journalContent) {
  if (weatherData.error) {
    alert("Error: " + weatherData.error);
    return;
  }
  let d = new Date();
  let newDate = d.toUTCString();
  const journalData = {
    weatherData: weatherData,
    date: newDate,
    journalContent: journalContent,
  };

  try {
    const response = await fetch("/api/addJournal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(journalData),
    });
    // const serverResponse = await response.json();
    // alert(serverResponse);
    return journalData;
  } catch (error) {
    // console.log("error", error);
    return { error: error };
  }
}

// Retrieves the weather data from the OpenWeatherMap API through the
// server. Returns the weather data or {error: error} if there is an
// error.
async function retrieveWeatherPOST(locationData) {
  const data = locationData;

  const response = await fetch("/api/weather", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  try {
    const weatherData = await response.json();
    // console.log("Weather: ", weatherData);
    return weatherData;
  } catch (error) {
    // console.log("error", error);
    return { error: error };
  }
}

// Function to obtain the user data and post the journal entry. No
// return value.
function postJournal() {
  const zip = document.getElementById("zip").value;
  const country = document.getElementById("country").value;
  const feelings = document.getElementById("feelings").value;
  if (!feelings) {
    alert("Please enter your feelings");
    return;
  }
  saveJournal({ zipCode: zip, countryCode: country }, feelings).then(
    (journal) => {
      if (!journal || journal.error) {
        console.log(journal.error);
        return;
      }
      updateUI(journal);
    }
  );
}

// Function to obtain the latest journal entry and update the UI. No
// return value.
function getJournal() {
  retrieveJournalGET().then((journal) => {
    if (!journal || journal.error) {
      console.log(journal.error);
      return;
    }
    updateUI(journal);
  });
}

// Function to update UI and add the latest journal entry. No return
// value.
function updateUI(journal) {
  document.getElementById("zip").value = "";
  document.getElementById("country").value = null;
  document.getElementById("feelings").value = "";
  if (Object.keys(journal).length === 0) {
    document.getElementById("date").innerHTML = "";
    document.getElementById("temp").innerHTML = "";
    document.getElementById("content").innerHTML = "No entries yet";
  } else {
    document.getElementById("date").innerHTML = journal.date;
    document.getElementById("temp").innerHTML =
      "Temperature: " + journal.weatherData.temperature + " F";
    document.getElementById("content").innerHTML =
      "Feelings: " + journal.journalContent;
  }
}

// Get the latest journal entry when the page loads
getJournal();
// Event listener for the generate button. Calls the postJournal
document.getElementById("generate").addEventListener("click", postJournal);
