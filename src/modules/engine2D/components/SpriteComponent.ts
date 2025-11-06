import { Component } from "../models/Component";

export class SpriteComponent extends Component {
  private _texture: string | null = null;
  private _color = "#ffffff";
  private _opacity = 1;
  private _visible = true;

  getName(): string {
    return "Sprite";
  }

  get texture(): string | null {
    return this._texture;
  }

  set texture(value: string | null) {
    this._texture = value;
  }

  get color(): string {
    return this._color;
  }

  set color(value: string) {
    this._color = value;
  }

  get opacity(): number {
    return this._opacity;
  }

  set opacity(value: number) {
    this._opacity = Math.max(0, Math.min(1, value));
  }

  get visible(): boolean {
    return this._visible;
  }

  set visible(value: boolean) {
    this._visible = value;
  }
}