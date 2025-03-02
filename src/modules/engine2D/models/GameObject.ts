import type { Cell } from "@/shared/types/Cell";
import { Body } from "matter-js";
import { v4 as uuid } from "uuid";
import type { IVector2 } from "../types/IVector2";
import { RigidBody2D } from "./RigidBody2D";
import { Transform } from "./Transform";

export class GameObject extends Transform implements Cell {
  cells: Cell[] = [];
  hash = uuid();
  name: string = "GameObject";

  constructor(_name: string) {
    super();
    this.name = _name;
  }

  public get Position(): IVector2 {
    return this.position;
  }
  public set Position(value: IVector2) {
    this.position = value;
    console.log(value);
    Body.setPosition(this._rigidBody.body, { x: value.x, y: value.y });
  }

  private _rigidBody: RigidBody2D = new RigidBody2D(Body.create({}));

  addCell(cell: Cell) {
    this.cells.push(cell);
    if (cell instanceof RigidBody2D) {
      this.rigidBody = cell;
    }
  }

  public get rigidBody(): RigidBody2D | null {
    return this._rigidBody;
  }
  public set rigidBody(value: RigidBody2D) {
    this._rigidBody = value;
  }
}
