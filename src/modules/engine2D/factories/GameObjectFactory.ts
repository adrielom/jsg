import type { IFactory } from "@/shared/types/IFactory";
import { Bodies } from "matter-js";
import EnumGeometry from "../enums/EnumGeometry";
import { GameObject } from "./../models/GameObject";
import { RigidBodyComponent } from "../components/RigidBodyComponent";

export class GameObjectFactory implements IFactory<GameObject> {
  geometry = EnumGeometry.None;
  side = 10;
  
  constructor(type: EnumGeometry) {
    this.geometry = type;
  }
  
  create(): GameObject {
    const gO = new GameObject(`GameObject`);
    let body;
    
    switch (this.geometry) {
      case EnumGeometry.Circle:
        body = Bodies.circle(gO.position.x, gO.position.y, this.side);
        break;
      case EnumGeometry.Rectangle:
        body = Bodies.rectangle(gO.position.x, gO.position.y, this.side, this.side);
        break;
      case EnumGeometry.Polygon:
        body = Bodies.polygon(gO.position.x, gO.position.y, 3, this.side);
        break;
      case EnumGeometry.Path:
        body = Bodies.fromVertices(gO.position.x, gO.position.y, []);
        break;
      default:
        body = Bodies.rectangle(gO.position.x, gO.position.y, this.side, this.side);
    }
    
    // Add RigidBody component
    if (body) {
      const rigidBodyComponent = new RigidBodyComponent(body);
      gO.addComponent(rigidBodyComponent);
    }
    
    return gO;
  }
  
  static createEmpty(name: string = "GameObject"): GameObject {
    return new GameObject(name);
  }
  
  static createWithRigidBody(name: string, geometry: EnumGeometry, size = 10): GameObject {
    const factory = new GameObjectFactory(geometry);
    factory.side = size;
    const gameObject = factory.create();
    gameObject.name = name;
    return gameObject;
  }
}
