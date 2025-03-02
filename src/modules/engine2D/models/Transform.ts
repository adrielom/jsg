import type { Cell } from "@/shared/types/Cell";
import type { IVector2 } from "../types/IVector2";
import { Vector2 } from "./Vector2";
import { v4 as uuid } from "uuid";

export class Transform implements Cell {
  hash = uuid();
  private _position: IVector2 = Vector2.zero();
  public get position(): IVector2 {
    return this._position;
  }
  public set position(value: IVector2) {
    this._position = value;
  }
}
