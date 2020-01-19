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
// functions to search concerts, songs and movies
function toSearchConcerts(name) {
  axios
    .get(
      `https://rest.bandsintown.com/artists/${name}/events?app_id=${keys.bandsId}`
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
}
function toSearchSongs(name) {
  var songsFromRes = [];
  if (name === "") {
    name = "The Sign";
    //   if user didn't enter the name of a song, the app will call api to get the info of the song "The Sign"
  }
  spotify
    .search({ type: "track", query: name })
    .then(function(response) {
      for (var i = 0; i < 20; i++) {
        songsFromRes.push(response.tracks.items[i].name);
      }
      var songIdx = songsFromRes.indexOf(name);
      var song = response.tracks.items[songIdx];
      console.log(
        `Artist(s): ${song.artists[0].name}\nThe song's name: ${song.name}\nPreview link: ${song.preview_url}\nThe album that the song is from: ${song.album.name}`
      );
    })
    .catch(function(err) {
      console.log("Sorry, it didn't work. Please try something else.");
    });
}
function toSearchMovies(name) {
  if (name === "") {
    name = "Mr. Nobody";
  }
  axios
    .get(`http://www.omdbapi.com/?t=${name}&apikey=${keys.movieId}`)
    .then(function(response) {
      var movie = response.data;
      var releasedYear = movie.Released.split(" ")[2];
      console.log(movie);
      console.log(
        `The title of the movie: ${movie.Title}\nReleased Year: ${releasedYear}\nIMDB Rating: ${movie.Ratings[0].Value}\nRotten Tomatoes Rating: ${movie.Ratings[1].Value}\nProduced Countries: ${movie.Country}\nLanguage: ${movie.Language}`
      );
      console.log(`Plot: ${movie.Plot}\nActors: ${movie.Actors}`);
    })
    .catch(function(error) {
      console.log("Sorry, it didn't work. Please try something else.");
    });
}
// function to take in commands from node or other files
function liri(operation, name) {
  switch (operation) {
    case "concert-this":
      toSearchConcerts(name);
      break;
    case "spotify-this-song":
      toSearchSongs(name);
      break;
    case "movie-this":
      toSearchMovies(name);
      break;
    case "do-what-it-says":
      fs.readFile("./random.txt", (err, data) => {
        if (err) throw err;
        var operation = data.toString().split(",")[0];
        var name = data
          .toString()
          .split(",")[1]
          .split('"')[1];
        name = toTitleCase(name);
        console.log(name);
        liri(operation, name);
      });
      break;
    default:
      console.log(
        `Unsupported command. Please try "concert-this", "spotify-this-song", "movie-this" or "do-what-it-says".`
      );
  }
}
liri(operation, name);
