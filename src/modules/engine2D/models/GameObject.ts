import { Body } from "matter-js";
import { v4 as uuid } from "uuid";
import type { IVector2 } from "../types/IVector2";
import { Transform } from "./Transform";
import { Component } from "./Component";
import { TransformComponent } from "../components/TransformComponent";
import { RigidBodyComponent } from "../components/RigidBodyComponent";
import { Logger } from "../utils/Logger";

export class GameObject extends Transform {
  hash = uuid();
  name: string = "GameObject";
  parent: GameObject | null = null;
  children: GameObject[] = [];
  components: Map<string, Component> = new Map();

  constructor(_name: string) {
    super();
    this.name = _name;
    // Add default transform component
    this.addComponent(new TransformComponent());
    
    const logger = Logger.getInstance();
    logger.debug(`GameObject created: ${this.name} (${this.hash})`, 'GameObject');
  }

  public get Position(): IVector2 {
    const transform = this.getComponent<TransformComponent>("Transform");
    return transform ? transform.position : this.position;
  }
  
  public set Position(value: IVector2) {
    const transform = this.getComponent<TransformComponent>("Transform");
    if (transform) {
      transform.position = value;
    }
    this.position = value;
    
    const rigidBody = this.getComponent<RigidBodyComponent>("RigidBody");
    if (rigidBody) {
      Body.setPosition(rigidBody.body, { x: value.x, y: value.y });
    }
  }



  // Component Management
  addComponent<T extends Component>(component: T): T {
    const logger = Logger.getInstance();
    const name = component.getName();
    
    if (this.components.has(name)) {
      logger.warn(`Component ${name} already exists on ${this.name}`, 'GameObject');
      return this.components.get(name) as T;
    }
    
    this.components.set(name, component);
    component.onAttach(this);
    

    
    logger.debug(`Added component ${name} to ${this.name}`, 'GameObject');
    return component;
  }

  removeComponent(componentName: string): boolean {
    const logger = Logger.getInstance();
    const component = this.components.get(componentName);
    if (!component) {
      logger.warn(`Component ${componentName} not found on ${this.name}`, 'GameObject');
      return false;
    }
    
    component.onDetach();
    const result = this.components.delete(componentName);
    logger.debug(`Removed component ${componentName} from ${this.name}`, 'GameObject');
    return result;
  }

  getComponent<T extends Component>(componentName: string): T | null {
    return (this.components.get(componentName) as T) || null;
  }

  hasComponent(componentName: string): boolean {
    return this.components.has(componentName);
  }

  getAllComponents(): Component[] {
    return Array.from(this.components.values());
  }

  // Hierarchy Management
  addChild(child: GameObject) {
    if (child.parent) {
      child.parent.removeChild(child);
    }
    child.parent = this;
    this.children.push(child);
  }

  removeChild(child: GameObject) {
    const index = this.children.indexOf(child);
    if (index > -1) {
      this.children.splice(index, 1);
      child.parent = null;
    }
  }

  findChild(name: string): GameObject | null {
    return this.children.find(child => child.name === name) || null;
  }

  findChildRecursive(name: string): GameObject | null {
    const direct = this.findChild(name);
    if (direct) return direct;
    
    for (const child of this.children) {
      const found = child.findChildRecursive(name);
      if (found) return found;
    }
    return null;
  }



  // Utility methods
  destroy() {
    const logger = Logger.getInstance();
    logger.debug(`Destroying GameObject: ${this.name} (${this.hash})`, 'GameObject');
    
    // Remove from parent
    if (this.parent) {
      this.parent.removeChild(this);
    }
    
    // Destroy all children
    [...this.children].forEach(child => child.destroy());
    
    // Remove all components
    this.components.forEach(component => component.onDetach());
    this.components.clear();
    
    logger.debug(`GameObject destroyed: ${this.name}`, 'GameObject');
  }
}
