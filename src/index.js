import Phaser from 'phaser';
import { Blob } from './lib/blob'

let player1 = {
  origin: { x: 0, y: 0 },
  color: 0xff0000,
  blobs: [
    new Blob(1, { location: { x: 3, y: 3 }}),
    new Blob(2, { location: { x: 45, y: 3 }}),
  ],
  move_blob(id, location) {
    const blobToMove = this.blobs.find(b => b.id === id);
    console.log(blobToMove);
    blobToMove.move(location.x, location.y);
  }
};

let player2 = {
  origin: { x: 0, y: 64/2 },
  color: 0x00ff00,
  blobs: [
    new Blob(10, { location: { x: 3, y: 29 }}),
    new Blob(10, { location: { x: 45, y: 29 }}),
  ]
};

class MyGame extends Phaser.Scene
{
    constructor () {
        super();
    }

    preload () {
    }
      
    create () {
      // So we have 4 fields in our "world".
      // Each field is mapped to offset on our display
      // Children are placed relative to the internal container origin (perfect for our case)

      let playfield1 = this.add.container(0, 0);
      playfield1.add(new Phaser.GameObjects.Rectangle(this, 0, 0, 96/2, 64/2, 0xff0000, 0.2).setOrigin(0, 0));

      let playfield2 = this.add.container(0, 64/2);
      playfield2.add(new Phaser.GameObjects.Rectangle(this, 0, 0, 96/2, 64/2, 0x00ff00, 0.2).setOrigin(0, 0));

      let playfield3 = this.add.container(96/2, 0);
      playfield3.add(new Phaser.GameObjects.Rectangle(this, 0, 0, 96/2, 64/2, 0x0000ff, 0.2).setOrigin(0, 0));

      let playfield4 = this.add.container(96/2, 64/2);
      playfield4.add(new Phaser.GameObjects.Rectangle(this, 0, 0, 96/2, 64/2, 0xffff00, 0.2).setOrigin(0, 0));

      // We also group the blobs so we have easy access later on
      this.player1Blobs = this.add.group();
      player1.blobs.forEach(b => {
        let circle = new Phaser.GameObjects.Arc(this, b.location.x, b.location.y, b.radius(), 0, 360, false, player1.color);
        this.player1Blobs.add(circle);
        playfield1.add(circle);     // Add to the player's field
      });

      // We also group the blobs so we have easy access later on
      this.player2Blobs = this.add.group();
      player2.blobs.forEach(b => {
        let circle = new Phaser.GameObjects.Arc(this, b.location.x, b.location.y, b.radius(), 0, 360, false, player2.color);
        this.player2Blobs.add(circle);
        playfield2.add(circle);     // Add to the player's field
      });
    }

    update() {
    }
}

const config = {
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
    scene: MyGame
};

const game = new Phaser.Game(config);
