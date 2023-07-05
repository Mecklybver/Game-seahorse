export class SoundController {
  constructor() {
      this.powerUpSound = new Audio("./sounds/powerup.wav")
      this.explosionSound = new Audio("./sounds/explosion.wav")
      this.hitSound = new Audio("./sounds/hit.wav")
      this.powerDownSound = new Audio("./sounds/powerdown.wav")
      this.shieldSound = new Audio("./sounds/shield.wav")
      this.shotSound = new Audio("./sounds/shot.wav")
    //   this.backgroundMusic = new Audio("./sounds/music.mp3");
      this.audioctx = new AudioContext();
      this.volume = this.audioctx.createGain()
      this.backgroundMusicBuffer = null;
      this.source = null;

      this.loadSoundFile("./sounds/music.mp3").then((buffer) => {
          this.backgroundMusicBuffer = buffer;
          this.playBackgroundMusic();
      });
  }

  async loadSoundFile(url) {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      return this.audioctx.decodeAudioData(arrayBuffer);
  }



  playBackgroundMusic() {
      this.source = this.audioctx.createBufferSource();
      this.source.buffer = this.backgroundMusicBuffer;
      this.source.connect(this.volume);
      this.volume.gain.value = 0.3
      this.volume.connect(this.audioctx.destination)
      this.source.loop = true;
      this.source.start();
  }

  stopBackgroundMusic() {
      if (this.source) {
          this.source.stop();
          this.source.disconnect();
          this.source = null;
      }
  }

  isBackgroundMusicPlaying() {
      return this.source && this.source.buffer && this.audioctx.state === "running";
  }





  powerUp() {
      this.powerUpSound.currentTime = 0;
      this.powerUpSound.play()
  }
  shot() {
      this.shotSound.currentTime = 0;
      this.shotSound.play()
  }
  powerDown() {
      this.powerDownSound.currentTime = 0;
      this.powerDownSound.play()
  }
  hit() {
      this.hitSound.currentTime = 0;
      this.hitSound.play()
  }
  explosion() {
      this.explosionSound.currentTime = 0;
      this.explosionSound.play()
  }
  shield() {
      this.shieldSound.currentTime = 0;
      this.shieldSound.play()
  }

}