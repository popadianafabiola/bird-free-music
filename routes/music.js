var express = require('express');
var lowDB = require('lowdb');
var router = express.Router();
var db = lowDB("music/music.json");

// reverse an array
db._.mixin({
  reverse: function (array) {
    return array.reverse();
  }
});

// shuffle songs
db._.mixin({
  shuffle: function (array) {
    var counter = array.length;

    // while there are elements in the array
    while (counter > 0) {
      // pick a random index
      var index = Math.floor(Math.random() * counter);

      // decrease counter by 1
      counter--;

      // and swap the last element with it
      var temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
    }
    return array;
  }
});

var songLimit = 500;

router.get('/', function (req, res, next) {
  res.send(db.get("songs").shuffle().value());
});

router.get('/happy', function (req, res, next) {
  res.send(db.get("songs")
    .sortBy("happy_percent")
    .reverse()
    .take(songLimit)
    .shuffle()
    .value());
});

router.get('/neutral', function (req, res, next) {
  res.send(db.get("songs")
    .sortBy("neutral_percent")
    .reverse()
    .take(songLimit)
    .shuffle()
    .value());
});

router.get('/sad', function (req, res, next) {
  res.send(db.get("songs")
    .sortBy("sad_percent")
    .reverse()
    .take(songLimit)
    .shuffle()
    .value());
});

router.get('/angry', function (req, res, next) {
  res.send(db.get("songs")
    .sortBy("angry_percent")
    .reverse()
    .take(songLimit)
    .shuffle()
    .value());
});

//update our mood
router.post('/update', function (req, res, next) {
  var mood = req.body.mood;
  var artist = req.body.artist;
  var name = req.body.name;

  var music = db.get('songs').find({
    artist: artist,
    name: name
  }).value();


  music.neutral_percent -= 1;
  music.angry_percent -= 1;
  music.happy_percent -= 1;
  music.sad_percent -= 1;

  if (mood == "Neutral") {
    music.neutral_percent += 2;
  } else if (mood == "Happy") {
    music.happy_percent += 2;
  } else if (mood == "Sad") {
    music.sad_percent += 2;
  } else if (mood == "Angry") {
    music.angry_percent -= 2;
  }

    db.get('songs')
    .find({
      artist: music.artist,
      name: music.name
    })
    .assign({
      neutral_percent: music.neutral_percent,
      angry_percent: music.angry_percent,
      happy_percent: music.happy_percent,
      sad_percent: music.sad_percent
    }).write();

  console.log(music);
  res.send("ok");

});

module.exports = router;