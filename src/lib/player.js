import { BlobHelper } from './blob_helper'
import { Blob } from './blob'

class Player {

  constructor({ color = 0xff0000, origin = { x: 0, y: 0 }} = {}) {
    this.color = color;
    this.origin = origin;
    this._setup_blobs();
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
      new Blob(1, { location: { x: 3, y: 3 }}),
      new Blob(2, { location: { x: 15, y: 8 }}),
      new Blob(3, { location: { x: 3, y: 13 }}),
      new Blob(4, { location: { x: 32, y: 44 }}),
    ]
  }

}

export { Player };
