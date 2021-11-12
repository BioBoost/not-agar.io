const config = {

  phaser: {
    type: Phaser.AUTO,
    parent: 'phaser-example',

    // Size of the canvas (size the game will render on)
    // World itself is actually infinite
    width: 96,
    height: 64,

    backgroundColor: '#333333',
    pixelArt: true,
    antialias: false,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
  },

  bugs_display: {
    width: 96,
    height: 64,
  },

  field: {
    width: 96/2,
    height: 64/2,

    // Min, Max coordinates
    X_MIN: 0,
    X_MAX: 96/2-1,
    Y_MIN: 0,
    Y_MAX: 64/2-1,
  }

}

export default config;