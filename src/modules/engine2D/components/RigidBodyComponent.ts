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

  get mass(): number {
    return this._body.mass;
  }

  set mass(value: number) {
    Body.setMass(this._body, Math.max(0.001, value));
  }

  get isKinematic(): boolean {
    return this._body.isStatic ?? false;
  }

  set isKinematic(value: boolean) {
    Body.setStatic(this._body, value);
  }

  applyForce(x: number, y: number) {
    Body.applyForce(this._body, this._body.position, { x, y });
  }

  get velocity() {
    return { x: this._body.velocity.x, y: this._body.velocity.y };
  }

  set velocity(value: { x: number; y: number }) {
    Body.setVelocity(this._body, value);
  }

  get color(): string {
    return this._body.render.fillStyle || '#ff6600';
  }

  set color(value: string) {
    this._body.render.fillStyle = value;
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