class Blob {
  constructor(id, { location = { x: 10, y: 10 }} = {}) {
    this.id = id;
    this.hp = 50;
    this.location = location
    console.log("Creating blob with radius = " + this.radius())
  }

  radius() {
    return Math.floor(Math.sqrt(this.hp / Math.PI));
  }

  move(x, y) {
    console.log("Moving blob to " + x + " " + y);
    this.location.x = x;
    this.location.y = y;
  }
}

export { Blob }