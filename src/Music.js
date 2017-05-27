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
