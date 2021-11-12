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

  merge(stable, target) {
    // Stable blob "sucks" in target blob
    console.log(`Merging blobs`);

    stable.heal(target.hp);
    stable.move(stable.location.x, stable.location.y) // Move to validate location
    target.kill();
  }
}

export default BlobHelper;