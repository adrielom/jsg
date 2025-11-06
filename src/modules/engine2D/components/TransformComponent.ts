import { Component } from "../models/Component";
import type { IVector2 } from "../types/IVector2";
import { Vector2 } from "../models/Vector2";

export class TransformComponent extends Component {
  private _position: IVector2 = Vector2.zero();
  private _rotation = 0;
  private _scale: IVector2 = new Vector2(1, 1);

  getName(): string {
    return "Transform";
  }

  get position(): IVector2 {
    return this._position;
  }

  set position(value: IVector2) {
    this._position = value;
  }

  get rotation(): number {
    return this._rotation;
  }

  set rotation(value: number) {
    this._rotation = value;
  }

  get scale(): IVector2 {
    return this._scale;
  }

  set scale(value: IVector2) {
    this._scale = value;
  }
}