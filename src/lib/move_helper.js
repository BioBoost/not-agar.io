const MoveHelper = {

  direction_to_dx_dy(direction, distance) {
    if (direction == 'up') return { dx: 0, dy: -distance }
    if (direction == 'down') return { dx: 0, dy: distance }
    if (direction == 'left') return { dx: -distance, dy: 0 }
    if (direction == 'right') return { dx: distance, dy: 0 }
  }

};

export { MoveHelper }