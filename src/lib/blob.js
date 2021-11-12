class Blob {
  constructor(id, { location = { x: 10, y: 10 }} = {}) {
    this.id = id;
    this.hp = 50;
    this.location = {};
    this.move(location.x, location.y);

    console.log("Creating blob with radius = " + this.radius());
  }

  radius() {
    return Math.floor(Math.sqrt(this.hp / Math.PI));
  }

  move(x, y) {
    console.log(`Moving blob from ${this.location.x}, ${this.location.y} to ${x}, ${y}`);
    console.log(`Radius of blob is ${this.radius()}`)

    // Make sure we can't jump outside or too close to border
    x = Math.max(x, config.playfield.X_MIN + this.radius());
    y = Math.max(y, config.playfield.Y_MIN + this.radius());

    x = Math.min(x, config.playfield.X_MAX - (this.radius()-1));
    y = Math.min(y, config.playfield.Y_MAX - (this.radius()-1));

    this.location.x = x;
    this.location.y = y;

    console.log(`End position ${x}, ${y}`);
  }

  heal(amount) {
    // What about moving blob if it becomes to big ??
    this.hp += amount;
  }

  kill() {
    this.hp = 0;
  }
  is_alive() {
    return this.hp > 0;
  }
}

export { Blob }