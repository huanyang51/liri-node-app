require("dotenv").config();
const fs = require("fs");
const axios = require("axios");
const moment = require("moment");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
// take in commands
const [_, __, operation] = process.argv;
var name = process.argv.slice(3).join(" ");
// No matter how user input the name, change the format to a title format
function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
name = toTitleCase(name);
switch (operation) {
  case "concert-this":
    axios
      .get(
        "https://rest.bandsintown.com/artists/" +
          name +
          "/events?app_id=codingbootcamp"
      )
      .then(function(response) {
        var events = response.data;
        var numOfEvents = events.length;
        if (numOfEvents === 0) {
          console.log(`No events found for ${name}.`);
        } else {
          for (var i = 0; i < numOfEvents; i++) {
            var venue = events[i].venue;
            var time = moment(events[i].datetime.split("T")[0]).format(
              "MM/DD/YYYY"
            );
            console.log(
              `Event ${[i + 1]}:\nName of the Venue: ${
                venue.name
              }\nThe Location of the Venue: ${venue.city}, ${venue.region}, ${
                venue.country
              }\nThe Date of the Event: ${time} `
            );
          }
        }
      });
    break;
  case "spotify-this-song":
    break;
  case "movie-this":
    break;
  case "do-what-it-says":
    break;
  default:
    console.log(
      `Unsupported command. Please try "concert-this", "spotify-this-song", "movie-this" or "do-what-it-says".`
    );
}
