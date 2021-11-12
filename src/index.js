import Phaser from 'phaser';
import { Blob } from './lib/blob'
import config from './config/config'

let player1 = {
  origin: { x: 0, y: 0 },
  color: 0xff0000,
  blobs: [
    new Blob(1, { location: { x: 3, y: 3 }}),
    new Blob(2, { location: { x: 15, y: 8 }}),
    new Blob(3, { location: { x: 3, y: 13 }}),
    new Blob(4, { location: { x: 32, y: 44 }}),
  ],
  move_blob(id, location) {
    const index = this.blobs.findIndex(b => b.id === id);
    let stable = this.blobs[index];
    console.log(stable);

    stable.move(location.x, location.y);

    // Moving blob = stable blob and sucks in other blobs around
    this.blobs.forEach((b, i) => {
      if (i !== index && BlobHelper.can_merge(stable, b)) {
        BlobHelper.merge(stable, b);
      }
    })
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

      const HALF_WIDTH = config.phaser.width / 2;
      const HALF_HEIGHT = config.phaser.height / 2;

      let playfield1 = this.add.container(0, 0);
      playfield1.add(new Phaser.GameObjects.Rectangle(this, 0, 0, HALF_WIDTH, HALF_HEIGHT, 0xff0000, 0.2).setOrigin(0, 0));

      let playfield2 = this.add.container(0, HALF_HEIGHT);
      playfield2.add(new Phaser.GameObjects.Rectangle(this, 0, 0, HALF_WIDTH, HALF_HEIGHT, 0x00ff00, 0.2).setOrigin(0, 0));

      let playfield3 = this.add.container(HALF_WIDTH, 0);
      playfield3.add(new Phaser.GameObjects.Rectangle(this, 0, 0, HALF_WIDTH, HALF_HEIGHT, 0x0000ff, 0.2).setOrigin(0, 0));

      let playfield4 = this.add.container(HALF_WIDTH, HALF_HEIGHT);
      playfield4.add(new Phaser.GameObjects.Rectangle(this, 0, 0, HALF_WIDTH, HALF_HEIGHT, 0xffff00, 0.2).setOrigin(0, 0));

      // We also group the blobs so we have easy access later on
      this.player1Blobs = this.add.group();
      player1.blobs.forEach(b => {
        let circle = new Phaser.GameObjects.Arc(this, b.location.x, b.location.y, b.radius(), 0, 360, false, player1.color);
          // .setScale(10)
          // 10*radius
          // 10*b.location.x
          // 10*b.location.y
        circle.setData('blob', b);
        this.player1Blobs.add(circle);
        playfield1.add(circle);     // Add to the player's field
      });

      // We also group the blobs so we have easy access later on
      this.player2Blobs = this.add.group();
      player2.blobs.forEach(b => {
        let circle = new Phaser.GameObjects.Arc(this, b.location.x, b.location.y, b.radius(), 0, 360, false, player2.color);
        circle.setData('blob', b);
        this.player2Blobs.add(circle);
        playfield2.add(circle);     // Add to the player's field
      });

    }

    update() {
      this.player1Blobs.children.iterate(function(b) {
        const blobData = b.getData('blob');
        b.x = blobData.location.x;
        b.y = blobData.location.y;
        b.setActive(blobData.is_alive())
        b.setRadius(blobData.radius())
        // b.destroy();   // Gives error - How can we destroy?
      }, this);
    }
}

const game = new Phaser.Game(Object.assign({scene: MyGame }, config.phaser));
