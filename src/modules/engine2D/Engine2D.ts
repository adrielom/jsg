import { Composites, Engine, Render, Runner } from "matter-js";
import { RenderFactory } from "./factories/RenderFactory";
import { Tree } from "./models/Tree";
import type { IEngine2D } from "./types/IEngine2D";
import type { GameObject } from "./models/GameObject";

export default class Engine2D {
  engine: IEngine2D;
  runner: Runner | null = null;
  htmlElement: HTMLElement;
  composites: Composites[];
  tree = new Tree(this);

  constructor(_htmlElement: HTMLElement) {
    this.engine = Engine.create();
    this.htmlElement = _htmlElement;
    this.runner = Runner.create();
    this.composites = [];
  }

  getRender(htmlElement: HTMLElement) {
    return new RenderFactory(this.engine, htmlElement).create();
  }

  start() {
    Render.run(this.getRender(this.htmlElement));
    Runner.run(this.runner!, this.engine);
  }

  addGameObject(gO: GameObject) {
    gO.name = `${gO.name} ${this.tree.elements.length}`;
    this.tree.add(gO);
  }
}
