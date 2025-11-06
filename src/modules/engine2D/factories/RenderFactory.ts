import { Render, Mouse, type IRendererOptions } from "matter-js";
import type { IEngine2D } from "../types/IEngine2D";
import type { IRender2D } from "../types/IRender2D";

export class RenderFactory {
  engine: IEngine2D | null = null;
  render: IRender2D | null = null;
  element: HTMLElement | null = null;
  mouse = Mouse;

  constructor(_engine: IEngine2D, _element: HTMLElement) {
    this.engine = _engine;
    this.element = _element;
  }

  create(options?: IRendererOptions) {
    try {
      return Render.create({
        canvas: this.element as HTMLCanvasElement,
        engine: this.engine!,
        options: {
          width: 800,
          height: 600,
          wireframes: false,
          background: 'transparent',
          showVelocity: false,
          showAngleIndicator: false,
          showDebug: false,
          ...options
        },
      });
    } catch (e) {
      throw new Error("Not able to create render " + (e as Error).message);
    }
  }
}
