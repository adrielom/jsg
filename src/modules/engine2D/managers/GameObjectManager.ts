import type { GameObject } from "../models/GameObject";
import type { Component } from "../models/Component";
import type { Tree } from "../models/Tree";
import { GameObjectFactory } from "../factories/GameObjectFactory";
import EnumGeometry from "../enums/EnumGeometry";

export class GameObjectManager {
  private tree: Tree;

  constructor(tree: Tree) {
    this.tree = tree;
  }

  // Create operations
  createGameObject(name: string = "GameObject"): GameObject {
    const gameObject = GameObjectFactory.createEmpty(name);
    gameObject.Position = { x: 400, y: 300 }; // Center of 800x600 canvas
    this.tree.add(gameObject);
    return gameObject;
  }

  createGameObjectWithRigidBody(
    name: string = "GameObject", 
    geometry: EnumGeometry = EnumGeometry.Rectangle, 
    size: number = 10
  ): GameObject {
    const gameObject = GameObjectFactory.createWithRigidBody(name, geometry, size);
    gameObject.Position = { x: 400, y: 300 }; // Center of 800x600 canvas
    
    // Set render colors for visibility and make static
    const rigidBody = gameObject.getComponent("RigidBody");
    if (rigidBody && (rigidBody as any).body) {
      const body = (rigidBody as any).body;
      body.render.fillStyle = name.includes('Player') ? '#0066ff' : '#ff6600';
      body.render.strokeStyle = '#ffffff';
      body.render.lineWidth = 2;
      body.isStatic = true; // Make static to prevent gravity
    }
    
    this.tree.add(gameObject);
    return gameObject;
  }

  // Remove operations
  removeGameObject(gameObject: GameObject): boolean {
    return this.tree.remove(gameObject);
  }

  removeGameObjectById(id: string): boolean {
    return this.tree.removeById(id);
  }

  removeGameObjectByName(name: string): boolean {
    return this.tree.removeByName(name);
  }

  // Find operations
  findGameObjectById(id: string): GameObject | null {
    return this.tree.findById(id);
  }

  findGameObjectByName(name: string): GameObject | null {
    return this.tree.findByName(name);
  }

  findGameObjectsByPattern(pattern: string): GameObject[] {
    return this.tree.findByNamePattern(pattern);
  }

  findGameObjectsWithComponent(componentName: string): GameObject[] {
    return this.tree.findWithComponent(componentName);
  }

  // Component operations
  addComponentToGameObject<T extends Component>(gameObject: GameObject, component: T): T {
    return gameObject.addComponent(component);
  }

  addComponentToGameObjectById<T extends Component>(id: string, component: T): T | null {
    const gameObject = this.findGameObjectById(id);
    return gameObject ? gameObject.addComponent(component) : null;
  }

  removeComponentFromGameObject(gameObject: GameObject, componentName: string): boolean {
    return gameObject.removeComponent(componentName);
  }

  removeComponentFromGameObjectById(id: string, componentName: string): boolean {
    const gameObject = this.findGameObjectById(id);
    return gameObject ? gameObject.removeComponent(componentName) : false;
  }

  getComponentFromGameObject<T extends Component>(gameObject: GameObject, componentName: string): T | null {
    return gameObject.getComponent<T>(componentName);
  }

  getComponentFromGameObjectById<T extends Component>(id: string, componentName: string): T | null {
    const gameObject = this.findGameObjectById(id);
    return gameObject ? gameObject.getComponent<T>(componentName) : null;
  }

  // Hierarchy operations
  setParent(child: GameObject, parent: GameObject | null) {
    if (parent) {
      parent.addChild(child);
    } else if (child.parent) {
      child.parent.removeChild(child);
    }
  }

  setParentById(childId: string, parentId: string | null) {
    const child = this.findGameObjectById(childId);
    if (!child) return false;

    if (parentId) {
      const parent = this.findGameObjectById(parentId);
      if (!parent) return false;
      parent.addChild(child);
    } else if (child.parent) {
      child.parent.removeChild(child);
    }
    return true;
  }

  // Utility operations
  getAllGameObjects(): GameObject[] {
    return this.tree.getAllGameObjects();
  }

  getGameObjectCount(): number {
    return this.tree.getCount();
  }

  clearAllGameObjects() {
    this.tree.clear();
  }

  // Duplicate operation
  duplicateGameObject(gameObject: GameObject): GameObject {
    const duplicate = GameObjectFactory.createEmpty(`${gameObject.name} Copy`);
    
    // Copy components
    gameObject.getAllComponents().forEach(component => {
      // Create new instances of components (simplified - you might want more sophisticated cloning)
      const componentName = component.getName();
      if (componentName !== "Transform") { // Transform is added by default
        // This is a simplified duplication - you'd need proper component cloning
        console.warn(`Component ${componentName} duplication not fully implemented`);
      }
    });
    
    // Copy transform
    duplicate.Position = { ...gameObject.Position };
    
    this.tree.add(duplicate);
    return duplicate;
  }
}