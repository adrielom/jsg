import { Render, Mouse } from "matter-js";
import type { IEngine2D } from "./types/IEngine2D";
import type { IRender2D } from "./types/IRender2D";

export class RenderFactory {
  engine: IEngine2D | null = null;
  render: IRender2D | null = null;
  element: HTMLElement | null = null;
  mouse = Mouse;

  constructor(_engine: IEngine2D, _element: HTMLElement) {
    this.engine = _engine;
    this.element = _element;
  }

  create() {
    try {
      return Render.create({
        element: this.element!,
        engine: this.engine!,
      });
    } catch (e) {
      throw new Error("Not able to create render " + (e as Error).message);
    }
  }
}
