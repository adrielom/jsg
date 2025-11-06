import { Component } from "../models/Component";
import { TransformComponent } from "../components/TransformComponent";
import { RigidBodyComponent } from "../components/RigidBodyComponent";
import { SpriteComponent } from "../components/SpriteComponent";
import { ScriptComponent } from "../components/ScriptComponent";
import { Bodies } from "matter-js";

export type ComponentConstructor = new (...args: any[]) => Component;

export class ComponentRegistry {
  private static components = new Map<string, ComponentConstructor>();

  static {
    // Register default components
    this.register("Transform", TransformComponent);
    this.register("RigidBody", RigidBodyComponent);
    this.register("Sprite", SpriteComponent);
    this.register("Script", ScriptComponent);
  }

  static register(name: string, componentClass: ComponentConstructor) {
    this.components.set(name, componentClass);
  }

  static create(name: string, ...args: any[]): Component | null {
    const ComponentClass = this.components.get(name);
    if (!ComponentClass) {
      console.warn(`Component ${name} not found in registry`);
      return null;
    }

    try {
      return new ComponentClass(...args);
    } catch (error) {
      console.error(`Failed to create component ${name}:`, error);
      return null;
    }
  }

  static getAvailableComponents(): string[] {
    return Array.from(this.components.keys());
  }

  static hasComponent(name: string): boolean {
    return this.components.has(name);
  }

  // Helper methods for creating specific components
  static createRigidBody(bodyType: 'rectangle' | 'circle' | 'polygon' = 'rectangle', size = 10): RigidBodyComponent | null {
    let body;
    switch (bodyType) {
      case 'circle':
        body = Bodies.circle(0, 0, size);
        break;
      case 'polygon':
        body = Bodies.polygon(0, 0, 6, size);
        break;
      default:
        body = Bodies.rectangle(0, 0, size, size);
    }
    return new RigidBodyComponent(body);
  }

  static createSprite(texture?: string, color = "#ffffff"): SpriteComponent {
    const sprite = new SpriteComponent();
    if (texture) sprite.texture = texture;
    sprite.color = color;
    return sprite;
  }

  static createScript(script = ""): ScriptComponent {
    const scriptComponent = new ScriptComponent();
    scriptComponent.script = script;
    return scriptComponent;
  }
}