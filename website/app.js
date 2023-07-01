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
  let newDate = d.getMonth() + "." + d.getDate() + "." + d.getFullYear();
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
