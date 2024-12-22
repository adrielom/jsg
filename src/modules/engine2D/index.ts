import { RenderFactory } from "./renderFactory";
import {
  Composite,
  Composites,
  Engine as MatterEngine,
  Render,
  Runner,
} from "matter-js";
import type { IEngine2D } from "./types/IEngine2D";

class Engine {
  engine: IEngine2D;
  runner: Runner | null = null;
  htmlElement: HTMLElement;
  composites: Composites[];

  constructor(_htmlElement: HTMLElement) {
    this.engine = MatterEngine.create();
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
}
