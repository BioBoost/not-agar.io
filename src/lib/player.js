import { BlobHelper } from './blob_helper'
import { Blob } from './blob'

class Player {

  constructor(id, { color = 0xff0000, origin = { x: 0, y: 0 }} = {}) {
    this.id = id;
    this.color = color;
    this.origin = origin;
    this._setup_blobs();
  }

  get_blob(id) {
    return this.blobs.find(b => b.id === id);
  }

  move_blob(id, dx, dy) {
    let stable = this.blobs.find(b => b.id === id);
    stable.set_location(stable.location.x+dx, stable.location.y+dy);
    this._suck_in_blobs(stable);
  }

  set_blob_location(id, location) {
    let stable = this.blobs.find(b => b.id === id);
    stable.set_location(location.x, location.y);
    this._suck_in_blobs(stable);
  }

  shoot(sourceBlob, targetPlayer, targetLocation) {
    let targetBlobs = BlobHelper.blobs_within_range(targetPlayer.blobs, targetLocation, sourceBlob.radius());

    // TODO Now damage the blobs that were in range !
    // TODO: https://mathworld.wolfram.com/Circle-CircleIntersection.html
    targetBlobs.forEach(b => {
      b.damage(sourceBlob.hp / 2);
    })
  }

  // Stable blob sucks in other blobs around
  _suck_in_blobs(stable) {
    this.blobs.forEach(b => {
      if (stable.id !== b.id && BlobHelper.can_merge(stable, b)) {
        BlobHelper.merge(stable, b);
      }
    })
  }

  _setup_blobs() {
    this.blobs = [
      new Blob('red', { location: { x: 10, y: 10 }, color: 0xff0000 }),
      new Blob('green', { location: { x: 10, y: 20 }, color: 0x00ff00 }),
      new Blob('blue', { location: { x: 30, y: 10 }, color: 0x0000ff }),
      new Blob('white', { location: { x: 30, y: 20 }, color: 0xffffff }),
    ]
  }

}

export { Player };
