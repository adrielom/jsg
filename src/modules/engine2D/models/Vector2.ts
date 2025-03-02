import type { IVector2 } from "../types/IVector2";

export class Vector2 implements IVector2 {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static zero() {
    return {
      x: 0,
      y: 0,
    };
  }
}
