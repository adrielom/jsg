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
    const rigidBody = element.getComponent("RigidBody");
    if (rigidBody && (rigidBody as any).body) {
      Composite.add(this.engine!.engine.world, (rigidBody as any).body);
    }
  }

  remove(element: GameObject): boolean {
    const index = this.elements.indexOf(element);
    if (index === -1) return false;
    
    // Remove from physics world
    const rigidBody = element.getComponent("RigidBody");
    if (rigidBody && (rigidBody as any).body) {
      Composite.remove(this.engine!.engine.world, (rigidBody as any).body);
    }
    
    // Remove from tree
    this.elements.splice(index, 1);
    
    // Destroy the game object
    element.destroy();
    
    return true;
  }

  removeById(id: string): boolean {
    const element = this.findById(id);
    return element ? this.remove(element) : false;
  }

  removeByName(name: string): boolean {
    const element = this.findByName(name);
    return element ? this.remove(element) : false;
  }

  findById(id: string): GameObject | null {
    return this.elements.find(el => el.hash === id) || null;
  }

  findByName(name: string): GameObject | null {
    return this.elements.find(el => el.name === name) || null;
  }

  findByNamePattern(pattern: string): GameObject[] {
    const regex = new RegExp(pattern, 'i');
    return this.elements.filter(el => regex.test(el.name));
  }

  findWithComponent(componentName: string): GameObject[] {
    return this.elements.filter(el => el.hasComponent(componentName));
  }

  getAllGameObjects(): GameObject[] {
    return [...this.elements];
  }

  clear() {
    // Remove all from physics world
    this.elements.forEach(element => {
      const rigidBody = element.getComponent("RigidBody");
      if (rigidBody && (rigidBody as any).body) {
        Composite.remove(this.engine!.engine.world, (rigidBody as any).body);
      }
      element.destroy();
    });
    
    this.elements = [];
  }

  getCount(): number {
    return this.elements.length;
  }
}
