import { Composites, Engine, Render, Runner, Events } from "matter-js";
import { RenderFactory } from "./factories/RenderFactory";
import { Tree } from "./models/Tree";
import type { IEngine2D } from "./types/IEngine2D";
import type { GameObject } from "./models/GameObject";
import { GameObjectManager } from "./managers/GameObjectManager";
import EnumGeometry from "./enums/EnumGeometry";
import { Logger } from "./utils/Logger";

type UpdateCallback = (deltaTime: number) => void;

export default class Engine2D {
  engine: IEngine2D;
  runner: Runner | null = null;
  htmlElement: HTMLElement;
  composites: Composites[];
  tree = new Tree(this);
  gameObjectManager: GameObjectManager;
  
  // Game loop properties
  private isRunning = false;
  private lastTime = 0;
  private updateCallbacks: UpdateCallback[] = [];
  private animationFrameId: number | null = null;

  constructor(_htmlElement: HTMLElement) {
    const logger = Logger.getInstance();
    logger.info('Initializing Engine2D', 'Engine2D');
    
    this.engine = Engine.create();
    this.htmlElement = _htmlElement;
    this.runner = Runner.create();
    this.composites = [];
    this.gameObjectManager = new GameObjectManager(this.tree);
    
    // Setup collision detection
    this.setupCollisionHandlers();
    
    logger.info('Engine2D initialized successfully', 'Engine2D');
  }

  getRender(htmlElement: HTMLElement) {
    return new RenderFactory(this.engine, htmlElement).create();
  }

  start() {
    const logger = Logger.getInstance();
    
    if (this.isRunning) {
      logger.warn('Engine already running', 'Engine2D');
      return;
    }
    
    logger.info('Starting Engine2D', 'Engine2D');
    
    this.isRunning = true;
    this.lastTime = performance.now();
    
    // Start Matter.js physics and rendering
    Render.run(this.getRender(this.htmlElement));
    Runner.run(this.runner!, this.engine);
    
    // Start custom game loop
    this.gameLoop();
    
    logger.info('Engine2D started successfully', 'Engine2D');
  }
  
  stop() {
    const logger = Logger.getInstance();
    logger.info('Stopping Engine2D', 'Engine2D');
    
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    logger.info('Engine2D stopped', 'Engine2D');
  }
  
  private gameLoop() {
    if (!this.isRunning) return;
    
    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
    this.lastTime = currentTime;
    
    // Update all game objects
    this.updateGameObjects(deltaTime);
    
    // Call registered update callbacks
    this.updateCallbacks.forEach(callback => callback(deltaTime));
    
    this.animationFrameId = requestAnimationFrame(() => this.gameLoop());
  }
  
  private updateGameObjects(deltaTime: number) {
    this.tree.elements.forEach(gameObject => {
      // Update all script components
      const scriptComponent = gameObject.getComponent("Script");
      if (scriptComponent && scriptComponent.enabled) {
        // Execute script update if it has one
        try {
          const updateFunc = (scriptComponent as any).update;
          if (typeof updateFunc === 'function') {
            updateFunc.call(scriptComponent, deltaTime);
          }
        } catch (error) {
          console.error(`Script update error in ${gameObject.name}:`, error);
        }
      }
    });
  }
  
  // Public API for registering update callbacks
  onUpdate(callback: UpdateCallback): () => void {
    this.updateCallbacks.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.updateCallbacks.indexOf(callback);
      if (index > -1) {
        this.updateCallbacks.splice(index, 1);
      }
    };
  }
  
  getIsRunning(): boolean {
    return this.isRunning;
  }



  // New enhanced methods using GameObjectManager
  createGameObject(name?: string): GameObject {
    const logger = Logger.getInstance();
    const gameObject = this.gameObjectManager.createGameObject(name);
    gameObject.name = `${gameObject.name} ${this.tree.elements.length - 1}`;
    logger.debug(`Created GameObject: ${gameObject.name} (${gameObject.hash})`, 'Engine2D');
    return gameObject;
  }

  createGameObjectWithPhysics(name?: string, geometry: EnumGeometry = EnumGeometry.Rectangle, size: number = 10): GameObject {
    const logger = Logger.getInstance();
    const gameObject = this.gameObjectManager.createGameObjectWithRigidBody(name, geometry, size);
    gameObject.name = `${gameObject.name} ${this.tree.elements.length - 1}`;
    logger.debug(`Created GameObject with physics: ${gameObject.name} (${gameObject.hash})`, 'Engine2D');
    return gameObject;
  }

  removeGameObject(gameObject: GameObject): boolean {
    return this.gameObjectManager.removeGameObject(gameObject);
  }

  removeGameObjectById(id: string): boolean {
    return this.gameObjectManager.removeGameObjectById(id);
  }

  findGameObject(id: string): GameObject | null {
    return this.gameObjectManager.findGameObjectById(id);
  }

  findGameObjectByName(name: string): GameObject | null {
    return this.gameObjectManager.findGameObjectByName(name);
  }

  searchGameObjects(pattern: string): GameObject[] {
    return this.gameObjectManager.findGameObjectsByPattern(pattern);
  }
  
  // Utility methods
  getDeltaTime(): number {
    return 1/60; // Default 60fps
  }
  
  getFrameRate(): number {
    return 60; // Could be calculated from actual frame times
  }
  
  private setupCollisionHandlers() {
    const logger = Logger.getInstance();
    
    Events.on(this.engine, 'collisionStart', (event) => {
      event.pairs.forEach(pair => {
        const objA = this.findGameObjectByBody(pair.bodyA);
        const objB = this.findGameObjectByBody(pair.bodyB);
        
        if (objA && objB) {
          logger.debug(`Collision started: ${objA.name} <-> ${objB.name}`, 'Collision');
          this.triggerCollisionEvent(objA, objB, 'start');
        }
      });
    });
    
    Events.on(this.engine, 'collisionEnd', (event) => {
      event.pairs.forEach(pair => {
        const objA = this.findGameObjectByBody(pair.bodyA);
        const objB = this.findGameObjectByBody(pair.bodyB);
        
        if (objA && objB) {
          logger.debug(`Collision ended: ${objA.name} <-> ${objB.name}`, 'Collision');
          this.triggerCollisionEvent(objA, objB, 'end');
        }
      });
    });
  }
  
  private findGameObjectByBody(body: any): GameObject | null {
    return this.tree.elements.find(obj => {
      const rb = obj.getComponent("RigidBody");
      return rb && (rb as any).body === body;
    }) || null;
  }
  
  private triggerCollisionEvent(objA: GameObject, objB: GameObject, type: 'start' | 'end') {
    // Trigger script component collision handlers
    const scriptA = objA.getComponent("Script");
    const scriptB = objB.getComponent("Script");
    
    if (scriptA && (scriptA as any).compiledScript) {
      const handler = type === 'start' ? 'onCollisionEnter' : 'onCollisionExit';
      const func = (scriptA as any).compiledScript[handler];
      if (typeof func === 'function') {
        try {
          func.call(scriptA, objB);
        } catch (error) {
          console.error(`Collision script error in ${objA.name}:`, error);
        }
      }
    }
    
    if (scriptB && (scriptB as any).compiledScript) {
      const handler = type === 'start' ? 'onCollisionEnter' : 'onCollisionExit';
      const func = (scriptB as any).compiledScript[handler];
      if (typeof func === 'function') {
        try {
          func.call(scriptB, objA);
        } catch (error) {
          console.error(`Collision script error in ${objB.name}:`, error);
        }
      }
    }
  }
  
  toString(): string {
    const lines: string[] = [];
    
    lines.push('=== ENGINE2D STRUCTURE ===');
    lines.push(`Running: ${this.isRunning}`);
    lines.push(`Update Callbacks: ${this.updateCallbacks.length}`);
    lines.push(`Total GameObjects: ${this.tree.elements.length}`);
    lines.push('');
    
    lines.push('=== GAME OBJECTS ===');
    this.tree.elements.forEach((gameObject, index) => {
      lines.push(`[${index}] ${gameObject.name} (${gameObject.hash})`);
      lines.push(`  Position: (${gameObject.Position.x.toFixed(2)}, ${gameObject.Position.y.toFixed(2)})`);
      lines.push(`  Components: ${gameObject.getAllComponents().length}`);
      
      gameObject.getAllComponents().forEach(component => {
        lines.push(`    - ${component.getName()} (enabled: ${component.enabled})`);
      });
      
      if (gameObject.children.length > 0) {
        lines.push(`  Children: ${gameObject.children.length}`);
        gameObject.children.forEach(child => {
          lines.push(`    - ${child.name} (${child.hash})`);
        });
      }
      
      lines.push('');
    });
    
    lines.push('=== PHYSICS WORLD ===');
    lines.push(`Bodies: ${this.engine.world.bodies.length}`);
    lines.push(`Constraints: ${this.engine.world.constraints.length}`);
    lines.push(`Gravity: (${this.engine.world.gravity.x}, ${this.engine.world.gravity.y})`);
    
    return lines.join('\n');
  }
}
