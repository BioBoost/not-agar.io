import Phaser from 'phaser';
import config from './config/config'
import { Player } from './lib/player'

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
      let circle = new Phaser.GameObjects.Arc(this, b.location.x, b.location.y, b.radius(), 0, 360, false, b.color);
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
      let circle = new Phaser.GameObjects.Arc(this, b.location.x, b.location.y, b.radius(), 0, 360, false, b.color);
      circle.setData('blob', b);
      this.player2Blobs.add(circle);
      playfield2.add(circle);     // Add to the player's field
    });

    this.shot = false;
  }

  update() {
    // Important Note !
    // Players can either move or shoot. Not both in 1 turn.
    // 1 turn = fixed number of seconds (for example 10)

    // Before we start moving we need to take note of the locations that are being shot at.
    // This because the blobs can move and we are keeping the shot locked at the original location.
    // This means you can evade a shot.
    // Basically a player is not actually shooting at a blob but rather at a location, but to make
    // it more user-friendly we are shooting at the current location of a given blob.
    //
    // Consider the following data coming from the client
    // shoot source: { player 1 (blob green) } target: { player 2 (blob red) }

    let shootActions = [{
      source: {
        player: player1,
        // This gives us the strength and start location of the shot
        // (maybe we need this later on for animations)
        blob: player1.get_blob('green')
      },
      target: {
        player: player2,
        // The location we are shooting at
        // blob may move in this turn (moves are done first)
        location: player2.get_blob('red').location
      },
    }];

    let cursors = this.input.keyboard.createCursorKeys();

    let dx = 0;
    let dy = 0;
    if (cursors.left.isDown) dx--;
    if (cursors.right.isDown) dx++;
    if (cursors.up.isDown) dy--;
    if (cursors.down.isDown) dy++;
    if (dx !== 0 || dy !== 0) player1.move_blob('green', dx, dy);

    if (!this.shot && cursors.space.isDown) {
      console.log("Player 1 is shooting at player 2 ...");
      // Now we should do the actual shooting based on the locations
      // player1.shoot(player1.get_blob('green'), player2, location);

      console.log(player2.get_blob('red'))

      shootActions.forEach(sa => {
        sa.source.player.shoot(
          sa.source.blob,
          sa.target.player,
          sa.target.location
        );
      });
      this.shot = true;
      
      console.log(player2.get_blob('red'))
    }


    this._update_player_blobs(this.player1Blobs);
    this._update_player_blobs(this.player2Blobs);
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
