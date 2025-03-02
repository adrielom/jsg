import type { IFactory } from "@/shared/types/IFactory";
import { Bodies } from "matter-js";
import EnumGeometry from "../enums/EnumGeometry";
import { GameObject } from "./../models/GameObject";
export class GameObjectFactory implements IFactory<GameObject> {
  geometry = EnumGeometry.None;
  side = 10;
  constructor(type: EnumGeometry) {
    this.geometry = type;
  }
  create(): GameObject {
    const gO = new GameObject(`GameObject`);
    switch (this.geometry) {
      case EnumGeometry.Circle:
        gO.rigidBody!.body = Bodies.circle(
          gO.position.x,
          gO.position.y,
          this.side
        );
        break;
      case EnumGeometry.Rectangle:
        gO.rigidBody!.body = Bodies.rectangle(
          gO.position.x,
          gO.position.y,
          this.side,
          this.side
        );
        break;
      case EnumGeometry.Polygon:
        gO.rigidBody!.body = Bodies.polygon(
          gO.position.x,
          gO.position.y,
          3,
          this.side
        );
        break;
      case EnumGeometry.Path:
        gO.rigidBody!.body = Bodies.fromVertices(
          gO.position.x,
          gO.position.y,
          []
        );
        break;
    }
    return gO;
  }
}
