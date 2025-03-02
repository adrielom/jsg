import { Body } from "matter-js";
import type { Cell } from "../../../shared/types/Cell";
import { v4 as uuid } from "uuid";

export class RigidBody2D implements Cell {
  hash: string | null = null;
  private _body: Body;

  public get body(): Body {
    return this._body;
  }
  public set body(value: Body) {
    this._body = value;
  }

  public isKinematic(): boolean {
    return this._body.isStatic ?? false;
  }

  public toggleKinematic() {
    this._body.isStatic = !this._body.isStatic;
  }

  constructor(body: Body) {
    this._body = body;
    this.hash = uuid();
  }
}
