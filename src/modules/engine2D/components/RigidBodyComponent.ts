import { Body } from "matter-js";
import { Component } from "../models/Component";

export class RigidBodyComponent extends Component {
  private _body: Body;

  constructor(body: Body) {
    super();
    this._body = body;
  }

  getName(): string {
    return "RigidBody";
  }

  get body(): Body {
    return this._body;
  }

  set body(value: Body) {
    this._body = value;
  }

  isKinematic(): boolean {
    return this._body.isStatic ?? false;
  }

  toggleKinematic() {
    this._body.isStatic = !this._body.isStatic;
  }

  isCollidingWith(otherBody: Body): boolean {
    // Check if this body is colliding with another specific body
    return this._body.parts.some(part => 
      otherBody.parts.some(otherPart => 
        part.bounds.min.x < otherPart.bounds.max.x &&
        part.bounds.max.x > otherPart.bounds.min.x &&
        part.bounds.min.y < otherPart.bounds.max.y &&
        part.bounds.max.y > otherPart.bounds.min.y
      )
    );
  }

  getCollidingBodies(): Body[] {
    // Get all bodies this one is currently colliding with
    const collidingBodies: Body[] = [];
    
    // Access the engine's collision pairs
    if (this._body.world && (this._body.world as any).engine) {
      const pairs = (this._body.world as any).engine.pairs.list;
      pairs.forEach((pair: any) => {
        if (pair.bodyA === this._body) {
          collidingBodies.push(pair.bodyB);
        } else if (pair.bodyB === this._body) {
          collidingBodies.push(pair.bodyA);
        }
      });
    }
    
    return collidingBodies;
  }
}