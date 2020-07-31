/* global fill, noFill, stroke, square*/

class LetterBox {
  constructor(x, y, side) {
    console.log("creating a square.");
    this.x = x;
    this.y = y;
    this.side = side;
  }

  show() {
    console.log("showing the squares.");
    fill(80);
    square(
      this.x,
      this.y,
      this.side,
      this.side / 4,
      this.side / 4,
      this.side / 4,
      this.side / 4
    );
  }

  letterGone() {
    noFill();
    stroke(60);
    square(
      this.x,
      this.y,
      this.side,
      this.side / 4,
      this.side / 4,
      this.side / 4,
      this.side / 4
    );
  }
}
