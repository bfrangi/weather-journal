async function retrieveJournalGET() {
  const response = await fetch("/api/currentJournal", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  try {
    const newData = await response.json();
    console.log("Current Journal:", newData);
    return newData;
  } catch (error) {
    console.log("error", error);
  }
}

async function addJournalPOST(locationData, journalContent) {
  retrieveWeatherPOST(locationData).then(async function (weatherData) {
    if (weatherData.error) {
      alert("Error: " + weatherData.error);
      return;
    }
    let d = new Date();
    let newDate = d.getMonth() + "." + d.getDate() + "." + d.getFullYear();
    const data = {
      weatherData: weatherData,
      date: newDate,
      journalContent: journalContent,
    };

    const response = await fetch("/api/addJournal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    try {
      const newData = await response.json();
      alert(newData);
      return newData;
    } catch (error) {
      console.log("error", error);
    }
  });
}

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
    const newData = await response.json();
    console.log("Weather: ", newData);
    return newData;
  } catch (error) {
    console.log("error", error);
  }
}

// retrieveJournalGET();

// addJournalPOST({ zipCode: 28045, countryCode: "ES" }, "Today was a good day :)");

// retrieveWeatherPOST();
