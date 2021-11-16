import Phaser from 'phaser';
import { Blob } from './lib/blob'
import config from './config/config'
import { Player } from './lib/player'
import axios from 'axios'

let player1 = new Player({
  color: 0xff0000,
  origin: { x: 0, y: 0 },
});

let player2 = new Player({
  color: 0x00ff00,
  origin: { x: 0, y: 64/2 },
});

class MyGame extends Phaser.Scene {

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
    
    this.snapshotCounter = 0;
  }

  update(t, tt) {
    let cursors = this.input.keyboard.createCursorKeys();

    let dx = 0;
    let dy = 0;
    if (cursors.left.isDown) dx--;
    if (cursors.right.isDown) dx++;
    if (cursors.up.isDown) dy--;
    if (cursors.down.isDown) dy++;
    if (dx !== 0 || dy !== 0) player1.move_blob(2, dx, dy);

    this._update_player_blobs(this.player1Blobs);
    this._update_player_blobs(this.player2Blobs);

    // TODO - Not sure if this is best approach
    // Schedule snapshot which we can send to the display
    if (++this.snapshotCounter == 10) {
      console.log("Rendering on 99 bugs display")
      this.game.renderer.snapshot((image) => {
        // Posting to backend because CORs is being pain in the ass with hyper (rust api).
        // Image is html img element with src set to base64 image data.
        // We do need to strip off the part that contains 'data:image/png;base64,`

        axios.post(`${config.backend.host}${config.backend.routes.display}`, {
          data: image.src.substring(22)
        })
        .then(function (response) {
          console.log(response);
        })
        .catch(function (error) {
          console.log(error);
        });
      }, 'image/png');

      this.updateCounter = 0
    }
  }

  // Update the graphical representation of the blobs
  _update_player_blobs(playerBlobs) {
    playerBlobs.children.iterate(function(b) {
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
