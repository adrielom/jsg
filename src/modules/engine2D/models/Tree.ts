import { Composite } from "matter-js";
import type Engine2D from "../Engine2D";
import type { GameObject } from "./GameObject";

export class Tree {
  elements: GameObject[] = [];
  engine: Engine2D | null = null;
  constructor(_engine: Engine2D) {
    this.engine = _engine;
  }

  add(element: GameObject) {
    this.elements.push(element);
    Composite.add(this.engine!.engine.world, element.rigidBody!.body!);
  }
}
