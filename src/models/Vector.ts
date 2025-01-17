import { Position } from '../types';

export class Vector {
  public x: number;
  public y: number;

  constructor(pos: Position) {
      this.x = pos.x;
      this.y = pos.y;
  }

  isEqual({ x, y }: Position) {
    return this.x === x && this.y === y;
  }

  add({x, y}: Position) {
    this.x += x;
    this.y += y;
    return this;
  }

  scalarMultiply(value: number) {
    this.x *= value;
    this.y *= value;
    return this;
  }

  clone(): Vector {
    return new Vector(this);
  }
}
