(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
class Music {

    constructor(json) {
      this.name = json.name;
      this.neutral_percent = json.neutral_percent;
      this.happy_percent = json.happy_percent;
      this.sad_percent = json.sad_percent;
      this.angry_percent = json.angry_percent;
      this.artist = json.artist;
      this.cover = json.cover;
      this.path = json.path;
    }


    playMusic() {
        console.log('music');
    }
}

module.exports = Music;

},{}],2:[function(require,module,exports){
class MusicCard {

    
    constructor(music) {
      this.music = music;
      this.className = "grid-item grid-item--width2 grid-item--height2";
    }

    isValid() {
        if(!this.music.artist)
            return false;
        if(!this.music.name)
            return false;
        if(!this.music.cover)
            return false;
        return true;
    }

    render() {
      

        var component = $("<div class='grid-item'> \
                            <h6 class='music-title'>" + this.music.artist + " - " + this.music.name + "<h6> \
                          </div>");
        component.css({'background-image': 'url(' + this.music.cover + ')'});
        return component;
    }

    playMusic() {
        console.log('music');
    }
}

module.exports = MusicCard;

},{}],3:[function(require,module,exports){
var Music = require('./Music');
var MusicCard = require('./MusicCard');


$(document).ready(function () {
    //Set initial mood
    var $grid = $('.grid');
    var currentMood = 'Neutral';
    var cards = [];
    var audioContext;
    loadMusic(currentMood);
    // music is done loading
    function loadMusic(currentMood) {
        $.get('../music/' + currentMood, function (musicData) {
            cards = [];
            if (audioContext) {
                audioContext.pause();
            }
            audioContext = new Audio();
            var songs = [];
            var initialSongs = 70;

            for (var i in musicData) {

                if (musicData[i]) {
                    var music = new Music(musicData[i]);
                    var musicCard = new MusicCard(music);


                    if (musicCard.isValid()) {
                        cards.push(musicCard);
                        if (cards.length < initialSongs) {
                            $('.grid').append(musicCard.render());
                        }

                        songs.push(musicData[i].artist + " - " + musicData[i].name);
                    }

                    console.log(musicData[i]);
                }
            }

            //setup autocomplete
            var options = {
                data: songs,
                list: {
                    match: {
                        enabled: true
                    },
                    showAnimation: {
                        type: "fade", //normal|slide|fade
                        time: 400,
                        callback: function () {}
                    },

                    hideAnimation: {
                        type: "slide", //normal|slide|fade
                        time: 400,
                        callback: function () {}
                    },
                    onChooseEvent: function () {
                        var searchedSong = $("#autocomplete").getSelectedItemData();
                        for (var i in cards) {
                            if (cards[i].music.artist + " - " + cards[i].music.name == searchedSong) {
                                var newCard = cards[i].render();
                                // add to packery layout
                                $grid.prepend(newCard).packery('prepended', newCard);
                                // make item elements draggable
                                newCard.each(function (index, item) {
                                    makeDraggableCard(i, item);
                                });
                                break;
                            }
                        }
                    }
                },
                theme: "square"
            };
            // autocomplete box
            $('#autocomplete').easyAutocomplete(options);


            //initialise packery grid
            $grid.packery({
                itemSelector: '.grid-item',
                columnWidth: 200
            });



            // make all grid-items draggable
            $grid.find('.grid-item').each(function (i, gridItem) {
                makeDraggableCard(i, gridItem);
            });


            //scroll bottom event
            $(window).scroll(function () {
                if ($(window).scrollTop() + $(window).height() == $(document).height()) {
                    for (var i = 0; i < 10; i++) {
                        var randomIndex = getRandomInt(0, cards.length);
                        var newCard = cards[randomIndex].render();
                        // add to packery layout
                        $grid.append(newCard).packery('appended', newCard);
                        // make item elements draggable
                        newCard.each(function (index, item) {
                            makeDraggableCard(randomIndex, item);
                        });
                    }
                }
            });

        });
    }

    function makeDraggableCard(i, gridItem) {
        $(gridItem).on('click', function () {
            if (audioContext) {
                audioContext.pause();
            }

            audioContext = new Audio(cards[i].music.path);
            // send the new object to the server
            $.post("../music/update", {
                name: cards[i].music.name,
                artist: cards[i].music.artist,
                mood: currentMood
            });
            audioContext.play();
        });

        var draggie = new Draggabilly(gridItem);
        // bind drag events to Packery
        $grid.packery('bindDraggabillyEvents', draggie);
    }

    // mood click
    $("li").click(function () {
        //clear active class for the rest of the moods
        $('li').each(function () {
            $(this).removeAttr('class');
        });
        currentMood = $(this).text();
        $(this).attr("class", "active");
        $grid.packery('destroy');
        $grid.empty();
        loadMusic(currentMood);
    });

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
});
},{"./Music":1,"./MusicCard":2}]},{},[1,2,3]);
