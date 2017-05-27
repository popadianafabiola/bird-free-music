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