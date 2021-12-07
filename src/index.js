import Phaser from 'phaser';
import config from './config/config'
import { Player } from './lib/player'
import axios from 'axios'

// Before we start moving we need to take note of the locations that are being shot at.
// This because the blobs can move and we are keeping the shot locked at the original location.
// This means you can evade a shot.
// Basically a player is not actually shooting at a blob but rather at a location, but to make
// it more user-friendly we are shooting at the current location of a given blob.

let player1 = new Player('one', {
  color: 0xff0000,
  origin: { x: 0, y: 0 },
});

let player2 = new Player('two', {
  color: 0x00ff00,
  origin: { x: 0, y: 64/2 },
});

// We need to fill this via websocket.
// It is processed once every ROUND_TIME
// This structure should only be filled with valid player actions !
// So no unknown players for example
let player_actions = [
  {
    type: 'move', player: player1, blob: 'green', dx: 3, dy: 0
  },
  {
    type: 'shoot',
    source: {
      player: player2,
      blob: player2.get_blob('red')
    },
    target: {
      player: player1,
      location: player1.get_blob('blue').location
    }
  }
]
// Important Note !
// Players can either move or shoot. Not both in 1 turn.
// 1 turn = fixed number of seconds (for example 10)

class MyGame extends Phaser.Scene {

  constructor () {
    super();
  }

  preload () { }
    
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
      let circle = new Phaser.GameObjects.Arc(this, b.location.x, b.location.y, b.radius(), 0, 360, false, b.color);
      circle.setData('blob', b);
      this.player1Blobs.add(circle);
      playfield1.add(circle);     // Add to the player's field
    });

    // We also group the blobs so we have easy access later on
    this.player2Blobs = this.add.group();
    player2.blobs.forEach(b => {
      let circle = new Phaser.GameObjects.Arc(this, b.location.x, b.location.y, b.radius(), 0, 360, false, b.color);
      circle.setData('blob', b);
      this.player2Blobs.add(circle);
      playfield2.add(circle);     // Add to the player's field
    });

    this.round = 1;
    this.snapshotCounter = 0;
  }

  update(time) {
    if ((time / (1000 * config.game.round_time)) >= this.round) {
      console.log(time)
      console.log("End of round " + this.round);

      // Move blobs first
      player_actions.filter((t) => t.type === 'move').forEach((action) => {
        action.player.move_blob(action.blob, action.dx, action.dy);
      });

      // Shoot next
      player_actions.filter((t) => t.type === 'shoot').map((action) => {
        action.source.player.shoot(
          action.source.blob,
          action.target.player,
          action.target.location
        );
      })

      this.round++;
    }

    this._update_player_blobs(this.player1Blobs);
    this._update_player_blobs(this.player2Blobs);

    // TODO - Not sure if this is best approach
    // Schedule snapshot which we can send to the display
    if (config.backend.enable_display && ++this.snapshotCounter == 10) {
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
