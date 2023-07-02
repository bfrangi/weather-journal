// ------------------------ GLOBAL VARIABLES -------------------------
const apiKey = "8652a7a57419b4daf75bb786f3cf7127&units=imperial";
const baseURL = "http://api.openweathermap.org/data/2.5/weather?";

// ------------------------- SETUP ENDPOINT --------------------------

projectData = {};
// projectData = {
//     temperature: 0,
//     date: '',
//     journalContent: '',
// };

// ---------------------- SETUP EXPRESS SERVER -----------------------

// Express to run server and routes
const express = require("express");
// Start up an instance of app
const app = express();

// ----------------------- SETUP DEPENDENCIES ------------------------

// Configure express to use body-parser as middle-ware.
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require("cors");
app.use(cors());

// Favicon
const favicon = require("serve-favicon");
const path = require('node:path'); 
app.use(favicon(path.join(__dirname,'website','public','images','favicon.ico')));

// ------------------------- SETUP API CALLS -------------------------

async function callWeatherAPI(locationData) {
  const url = `${baseURL}zip=${locationData.zipCode},${locationData.countryCode}&appid=${apiKey}`;
  console.log("        Requesting data from: ", url);
  try {
    const response = await fetch(url);
    const jsonData = await response.json();
    if (jsonData.cod != 200) {
      console.log("        Error: ", jsonData.message);
      return { error: jsonData.message };
    }
    const weatherData = {
      temperature: jsonData.main.temp,
      location: jsonData.name,
      weather:
        jsonData.weather[0].main + ": " + jsonData.weather[0].description,
    };
    console.log("        Obtained response from OpenWeatherAPI: ", weatherData);
    return weatherData;
  } catch (error) {
    console.log("        Error: ", error);
    return { error: error };
  }
}

// -------------------------- SETUP ROUTES ---------------------------

// Route to get the current weather journal data
app.get("/api/currentJournal", function (req, res) {
  console.log("GET /currentJournal");
  res.send(projectData);
  console.log("    Sent project data: ", projectData);
});

// Route to add a new weather journal entry
app.post("/api/addJournal", function (req, res) {
  console.log("POST /api/addJournal");
  projectData = {
    weatherData: req.body.weatherData,
    date: req.body.date,
    journalContent: req.body.journalContent,
  };
  console.log("    Updated project data: ", projectData);
  res.send(JSON.stringify("Journal added successfully!"));
});

// Route to get the current weather data
app.post("/api/weather", async function (req, res) {
  console.log("POST /api/weather");
  locationData = {
    zipCode: req.body.zipCode,
    countryCode: req.body.countryCode,
  };
  console.log("    Getting data for location: " + JSON.stringify(locationData));
  const weatherData = await callWeatherAPI(locationData);
  res.send(weatherData);
  console.log("    Sent data from OpenWeatherAPI to client: ", weatherData);
});

// --------------------------- RUN SERVER ----------------------------

/* Initializing the main project folder */
app.use(express.static("website"));

// Spin up the server
const port = 3000;
const server = app.listen(port, listening);

function listening() {
  console.log(`Server running on localhost:${port}`);
}
