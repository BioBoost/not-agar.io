const BlobHelper = {
  can_merge(blob1, blob2) {
    const distance = Phaser.Math.Distance.Between(
      blob1.location.x,
      blob1.location.y,
      blob2.location.x,
      blob2.location.y
    ).toFixed(0);

    return (distance < blob1.radius() + blob2.radius())
  },

  // Stable blob "sucks" in target blob
  merge(stable, target) {
    stable.heal(target.hp);
    stable.set_location(stable.location.x, stable.location.y) // Move to validate location
    target.kill();
  },

  is_within_blob(blob, location) {
    const distance = Phaser.Math.Distance.Between(
      blob.location.x,
      blob.location.y,
      location.x,
      location.y
    ).toFixed(0);

    return (distance < blob.radius());
  },

  is_within_range_of_blob(blob, location, range) {
    const distance = Phaser.Math.Distance.Between(
      blob.location.x,
      blob.location.y,
      location.x,
      location.y
    ).toFixed(0);

    return (distance <= range);
  },

  blobs_within_range(blobs, location, range) {
    return blobs.filter((b) => 
      this.is_within_range_of_blob(b, location, range)
    );
  },

}

export { BlobHelper };