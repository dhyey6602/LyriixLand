var express = require("express");
var request = require("request");
var app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
console.log(__dirname + "/public");

//************Routes****************
//HomePage
app.get("/", function(req, res) {
  res.render("home");
});
//Result
app.get("/results", function(req, res) {
  //To change song name to acceptable format
  var songName = req.query.SongName;
  var modifiedSongName = "";
  for (let i = 0; i < songName.length; i++) {
    if (songName[i] == " ") {
      modifiedSongName += "%20";
    } else {
      modifiedSongName += songName[i];
    }
  }
  //to change artist name to acceptable format
  var artistName = req.query.ArtistName;
  var modifiedArtistName = "";
  for (let i = 0; i < artistName.length; i++) {
    if (artistName[i] == " ") {
      modifiedArtistName += "%20";
    } else {
      modifiedArtistName += artistName[i];
    }
  }
  //making request for access to lyrics database
  var url =
    "https://lyric-api.herokuapp.com/api/find/" +
    modifiedArtistName +
    "/" +
    modifiedSongName;
  request(url, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var parsedData = JSON.parse(body);
      //res.send(parsedData["lyric"]);
      res.render("result", {
        lyrics: parsedData.lyric,
        artist: artistName,
        song: songName
      });
    } else {
      res.send("please write name of song and artist appropriately");
    }
  });
});

//Server
app.listen("8081", function() {
  console.log("Lyric Search started");
});
