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
