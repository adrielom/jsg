# JSG Engine2D Documentation

JSG Engine2D is a component-based 2D game engine built with TypeScript, Matter.js physics, and framework-agnostic design.

## 🚀 Quick Start

### Basic Setup

```typescript
import Engine2D from '@/modules/engine2D/Engine2D';

// Create engine instance
const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const engine = new Engine2D(canvas);

// Start the engine
engine.start();
```

### With Vue/Pinia Store

```typescript
import { useEngine2D } from '@/shared/stores/engine2D';

const engine = useEngine2D();
engine.setTargetElement(canvasElement);
engine.start();
```

## 🎮 Core Concepts

### Game Objects
Everything in the scene is a GameObject with components attached.

```typescript
// Create empty game object
const player = engine.createGameObject("Player");

// Create with physics
const box = engine.createGameObjectWithPhysics("Box", EnumGeometry.Rectangle, 50);
```

### Components
Modular functionality attached to GameObjects.

```typescript
// Add components
const sprite = ComponentRegistry.createSprite(null, "#ff0000");
player.addComponent(sprite);

// Get components
const transform = player.getComponent("Transform");
const rigidBody = player.getComponent("RigidBody");
```

### Game Loop
Framework-independent update system.

```typescript
// Register update callback
const unsubscribe = engine.onUpdate((deltaTime) => {
  // Your game logic here
  player.Position = new Vector2(player.Position.x + 100 * deltaTime, player.Position.y);
});

// Cleanup when done
unsubscribe();
```

## 📦 GameObject Management

### Creating Objects

```typescript
// Empty object
const obj = engine.createGameObject("MyObject");

// With physics body
const physicsObj = engine.createGameObjectWithPhysics(
  "PhysicsObject", 
  EnumGeometry.Circle, 
  25
);

// Using factory directly
const customObj = GameObjectFactory.createWithRigidBody(
  "Custom", 
  EnumGeometry.Polygon, 
  30
);
```

### Finding Objects

```typescript
// By ID
const obj = engine.findGameObject("uuid-string");

// By name
const player = engine.findGameObjectByName("Player");

// Pattern search
const enemies = engine.searchGameObjects("Enemy.*");

// With specific component
const physicsObjects = engine.gameObjectManager.findGameObjectsWithComponent("RigidBody");
```

### Removing Objects

```typescript
// Remove by reference
engine.removeGameObject(gameObject);

// Remove by ID
engine.removeGameObjectById("uuid-string");

// Remove by name
engine.gameObjectManager.removeGameObjectByName("Enemy");
```

## 🔧 Component System

### Built-in Components

#### Transform Component
```typescript
const transform = gameObject.getComponent("Transform");
transform.position = new Vector2(100, 200);
transform.rotation = Math.PI / 4;
transform.scale = new Vector2(2, 2);
```

#### RigidBody Component
```typescript
const rb = gameObject.getComponent("RigidBody") as RigidBodyComponent;
rb.body.isStatic = true;
rb.body.restitution = 0.8;
rb.toggleKinematic();
```

#### Sprite Component
```typescript
const sprite = ComponentRegistry.createSprite("texture.png", "#ff0000");
sprite.opacity = 0.5;
sprite.visible = false;
gameObject.addComponent(sprite);
```

#### Script Component
```typescript
const script = ComponentRegistry.createScript(`
  function start() {
    console.log('GameObject started:', gameObject.name);
  }
  
  function update(deltaTime) {
    // Move right continuously
    gameObject.Position = new Vector2(
      gameObject.Position.x + 50 * deltaTime,
      gameObject.Position.y
    );
  }
  
  function destroy() {
    console.log('GameObject destroyed');
  }
`);
gameObject.addComponent(script);
```

### Custom Components

```typescript
class HealthComponent extends Component {
  private _health = 100;
  
  getName(): string {
    return "Health";
  }
  
  get health(): number {
    return this._health;
  }
  
  takeDamage(amount: number) {
    this._health -= amount;
    if (this._health <= 0) {
      this.gameObject?.destroy();
    }
  }
}

// Register custom component
ComponentRegistry.register("Health", HealthComponent);

// Use it
const health = new HealthComponent();
gameObject.addComponent(health);
```

## 🌳 Hierarchy System

### Parent-Child Relationships

```typescript
const parent = engine.createGameObject("Parent");
const child = engine.createGameObject("Child");

// Set hierarchy
parent.addChild(child);

// Find children
const foundChild = parent.findChild("Child");
const deepChild = parent.findChildRecursive("DeepChild");

// Remove from parent
parent.removeChild(child);
```

## 🎯 Game Loop & Updates

### Engine Loop

```typescript
// Start/stop engine
engine.start();
engine.stop();

// Check if running
if (engine.getIsRunning()) {
  console.log("Engine is running");
}
```

### Hook-Based Game Loop (React)

```typescript
import { useGameLoop } from '@/modules/engine2D/hooks';

// Simple game loop
useGameLoop(engine, (deltaTime) => {
  // Game logic runs every frame
  player.Position = new Vector2(
    player.Position.x + speed * deltaTime,
    player.Position.y
  );
});

// With dependencies
const [speed, setSpeed] = useState(100);
useGameLoop(engine, (deltaTime) => {
  player.Position = new Vector2(
    player.Position.x + speed * deltaTime,
    player.Position.y
  );
}, [speed]); // Re-creates callback when speed changes
```

### Composable-Based Game Loop (Vue)

```typescript
import { useGameLoop } from '@/modules/engine2D/composables';

// Simple game loop
const player = ref(null);
const speed = ref(100);

useGameLoop(engine, (deltaTime) => {
  if (player.value) {
    player.value.Position = new Vector2(
      player.value.Position.x + speed.value * deltaTime,
      player.value.Position.y
    );
  }
}, [player, speed]); // Reactive dependencies
```

### Subscription-Based (Vue/Vanilla)

```typescript
// Register multiple callbacks
const unsubscribe1 = engine.onUpdate((deltaTime) => {
  // Game logic
});

const unsubscribe2 = engine.onUpdate((deltaTime) => {
  // UI updates
});

// Cleanup
unsubscribe1();
unsubscribe2();
```

### Script Component Updates

```typescript
const movementScript = `
  let speed = 100;
  let direction = 1;
  
  function update(deltaTime) {
    gameObject.Position = new Vector2(
      gameObject.Position.x + speed * direction * deltaTime,
      gameObject.Position.y
    );
    
    // Bounce at edges
    if (gameObject.Position.x > 400 || gameObject.Position.x < 0) {
      direction *= -1;
    }
  }
`;
```

## 🎨 Physics Integration

### Matter.js Bodies

```typescript
// Access physics body
const rb = gameObject.getComponent("RigidBody") as RigidBodyComponent;
const body = rb.body;

// Physics properties
body.isStatic = true;
body.restitution = 0.8;  // Bounciness
body.friction = 0.1;     // Surface friction
body.frictionAir = 0.01; // Air resistance
body.density = 0.001;    // Mass density
```

### Collision Detection

```typescript
// In script component
function update(deltaTime) {
  const rb = gameObject.getComponent("RigidBody");
  
  // Check for collisions (simplified)
  if (rb.body.position.y > 500) {
    console.log("Hit ground!");
  }
}
```

## 🛠 Advanced Usage

### Component Registry

```typescript
// Get available components
const available = ComponentRegistry.getAvailableComponents();

// Create by name
const component = ComponentRegistry.create("Sprite");

// Helper methods
const rigidBody = ComponentRegistry.createRigidBody('circle', 20);
const sprite = ComponentRegistry.createSprite('texture.png', '#00ff00');
```

### Batch Operations

```typescript
// Get all objects
const allObjects = engine.gameObjectManager.getAllGameObjects();

// Clear scene
engine.gameObjectManager.clearAllGameObjects();

// Get count
const count = engine.gameObjectManager.getGameObjectCount();
```

### Object Duplication

```typescript
const original = engine.createGameObjectWithPhysics("Original");
const copy = engine.gameObjectManager.duplicateGameObject(original);
```

## 📱 Framework Integration

### Vue.js Example (Composables)

```vue
<template>
  <canvas ref="gameCanvas" width="800" height="600"></canvas>
  <button @click="startGame">Start Game</button>
</template>

<script setup>
import { ref } from 'vue';
import { useEngine2D, useGameLoop } from '@/modules/engine2D/composables';
import { EnumGeometry, Vector2 } from '@/modules/engine2D';

const gameCanvas = ref();
const { engine, initEngine } = useEngine2D(gameCanvas);
const player = ref(null);

// Game loop using composable
useGameLoop(engine, (deltaTime) => {
  if (player.value) {
    // Game logic here
  }
}, [player]);

const startGame = () => {
  const engineInstance = initEngine();
  if (engineInstance) {
    player.value = engineInstance.createGameObjectWithPhysics("Player", EnumGeometry.Circle, 25);
    player.value.Position = new Vector2(400, 300);
  }
};
</script>
```

### Vue.js Example (Pinia Store)

```vue
<template>
  <canvas ref="gameCanvas" width="800" height="600"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useEngine2D } from '@/shared/stores/engine2D';

const gameCanvas = ref();
const engine = useEngine2D();
let unsubscribe = null;

onMounted(() => {
  engine.setTargetElement(gameCanvas.value);
  engine.start();
  
  // Game logic
  unsubscribe = engine.engine2D.onUpdate((deltaTime) => {
    // Update game state
  });
});

onUnmounted(() => {
  unsubscribe?.();
  engine.engine2D?.stop();
});
</script>
```

### React Example

```tsx
import React, { useRef, useState } from 'react';
import { useEngine2D, useGameLoop } from '@/modules/engine2D/hooks';
import { EnumGeometry, Vector2 } from '@/modules/engine2D';

function GameComponent() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engine = useEngine2D(canvasRef);
  const [score, setScore] = useState(0);
  const [player, setPlayer] = useState(null);
  
  // Initialize game objects
  React.useEffect(() => {
    if (!engine) return;
    
    const newPlayer = engine.createGameObjectWithPhysics("Player", EnumGeometry.Circle, 25);
    newPlayer.Position = new Vector2(400, 300);
    setPlayer(newPlayer);
  }, [engine]);
  
  // Game loop using hook
  useGameLoop(engine, (deltaTime) => {
    if (!player) return;
    
    // Game logic here
    if (player.Position.y > 500) {
      setScore(prev => prev + 10);
      player.Position = new Vector2(400, 50);
    }
  }, [player]);
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (!player) return;
    
    switch(e.key) {
      case 'ArrowLeft':
        player.Position = new Vector2(player.Position.x - 10, player.Position.y);
        break;
      case 'ArrowRight':
        player.Position = new Vector2(player.Position.x + 10, player.Position.y);
        break;
    }
  };
  
  return (
    <div onKeyDown={handleKeyPress} tabIndex={0}>
      <canvas ref={canvasRef} width={800} height={600} />
      <div>Score: {score}</div>
    </div>
  );
}
```

### Vanilla JavaScript

```javascript
const canvas = document.getElementById('game');
const engine = new Engine2D(canvas);

engine.start();

// Create game objects
const player = engine.createGameObjectWithPhysics("Player", EnumGeometry.Circle, 25);
player.Position = new Vector2(400, 300);

// Game loop
engine.onUpdate((deltaTime) => {
  // Handle input, update game state
});
```

### Angular Example

```typescript
import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import Engine2D, { EnumGeometry, Vector2 } from '@/modules/engine2D';

@Component({
  selector: 'app-game',
  template: `<canvas #gameCanvas width="800" height="600"></canvas>`
})
export class GameComponent implements OnInit, OnDestroy {
  @ViewChild('gameCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private engine!: Engine2D;
  private unsubscribe?: () => void;
  
  ngOnInit() {
    this.engine = new Engine2D(this.canvasRef.nativeElement);
    this.engine.start();
    
    // Create game objects
    const player = this.engine.createGameObjectWithPhysics("Player", EnumGeometry.Circle, 25);
    player.Position = new Vector2(400, 300);
    
    // Game loop
    this.unsubscribe = this.engine.onUpdate((deltaTime) => {
      // Game logic here
    });
  }
  
  ngOnDestroy() {
    this.unsubscribe?.();
    this.engine?.stop();
  }
}
```

### Svelte Example

```svelte
<script>
  import { onMount, onDestroy } from 'svelte';
  import Engine2D, { EnumGeometry, Vector2 } from '@/modules/engine2D';
  
  let canvas;
  let engine;
  let unsubscribe;
  
  onMount(() => {
    engine = new Engine2D(canvas);
    engine.start();
    
    // Create game objects
    const player = engine.createGameObjectWithPhysics("Player", EnumGeometry.Circle, 25);
    player.Position = new Vector2(400, 300);
    
    // Game loop
    unsubscribe = engine.onUpdate((deltaTime) => {
      // Game logic here
    });
  });
  
  onDestroy(() => {
    unsubscribe?.();
    engine?.stop();
  });
</script>

<canvas bind:this={canvas} width="800" height="600"></canvas>
```

### Solid.js Example

```tsx
import { onMount, onCleanup } from 'solid-js';
import Engine2D, { EnumGeometry, Vector2 } from '@/modules/engine2D';

function GameComponent() {
  let canvas: HTMLCanvasElement;
  let engine: Engine2D;
  let unsubscribe: (() => void) | undefined;
  
  onMount(() => {
    engine = new Engine2D(canvas);
    engine.start();
    
    // Create game objects
    const player = engine.createGameObjectWithPhysics("Player", EnumGeometry.Circle, 25);
    player.Position = new Vector2(400, 300);
    
    // Game loop
    unsubscribe = engine.onUpdate((deltaTime) => {
      // Game logic here
    });
  });
  
  onCleanup(() => {
    unsubscribe?.();
    engine?.stop();
  });
  
  return <canvas ref={canvas} width="800" height="600" />;
}
```

## 🎮 Complete Game Example

```typescript
class SimpleGame {
  private engine: Engine2D;
  private player: GameObject;
  private enemies: GameObject[] = [];
  
  constructor(canvas: HTMLCanvasElement) {
    this.engine = new Engine2D(canvas);
    this.init();
  }
  
  init() {
    // Create player
    this.player = this.engine.createGameObjectWithPhysics("Player", EnumGeometry.Circle, 20);
    this.player.Position = new Vector2(400, 300);
    
    // Create enemies
    for (let i = 0; i < 5; i++) {
      const enemy = this.engine.createGameObjectWithPhysics("Enemy", EnumGeometry.Rectangle, 30);
      enemy.Position = new Vector2(Math.random() * 800, Math.random() * 600);
      this.enemies.push(enemy);
    }
    
    // Start game loop
    this.engine.start();
    this.engine.onUpdate((deltaTime) => this.update(deltaTime));
  }
  
  update(deltaTime: number) {
    // Move enemies
    this.enemies.forEach(enemy => {
      enemy.Position = new Vector2(
        enemy.Position.x + Math.sin(Date.now() * 0.001) * 50 * deltaTime,
        enemy.Position.y
      );
    });
  }
  
  handleInput(key: string) {
    switch(key) {
      case 'ArrowLeft':
        this.player.Position = new Vector2(this.player.Position.x - 5, this.player.Position.y);
        break;
      case 'ArrowRight':
        this.player.Position = new Vector2(this.player.Position.x + 5, this.player.Position.y);
        break;
    }
  }
}

// Usage
const game = new SimpleGame(document.getElementById('canvas'));
```

## 🔍 Debugging & Performance

### Debug Information

```typescript
// Engine state
console.log('Running:', engine.getIsRunning());
console.log('Frame Rate:', engine.getFrameRate());
console.log('Object Count:', engine.gameObjectManager.getGameObjectCount());

// GameObject inspection
gameObject.getAllComponents().forEach(component => {
  console.log('Component:', component.getName(), 'Enabled:', component.enabled);
});
```

### Performance Tips

1. **Limit update callbacks** - Use sparingly for heavy operations
2. **Pool objects** - Reuse GameObjects instead of creating/destroying
3. **Batch operations** - Group similar operations together
4. **Component efficiency** - Remove unused components
5. **Physics optimization** - Use static bodies for non-moving objects

## 🪝 React Hooks

### useEngine2D
```typescript
const engine = useEngine2D(canvasRef);
// Automatically initializes and cleans up engine
```

### useGameLoop
```typescript
useGameLoop(engine, (deltaTime) => {
  // Game logic
}, [dependencies]);
// Handles subscription/cleanup automatically
```

## 🎭 Vue Composables

### useEngine2D
```typescript
const { engine, initEngine, stopEngine } = useEngine2D(canvasRef);
// Manual control over engine lifecycle
```

### useGameLoop
```typescript
useGameLoop(engine, (deltaTime) => {
  // Game logic
}, [dependencies]);
// Reactive dependencies with Vue refs
```

## 🌐 Framework Compatibility

JSG Engine2D is **framework-agnostic** and works with any JavaScript framework or vanilla JS:

- ✅ **React** - Use provided hooks for seamless integration
- ✅ **Vue** - Use provided composables for reactive integration  
- ✅ **Angular** - Standard lifecycle integration
- ✅ **Svelte** - Simple onMount/onDestroy pattern
- ✅ **Solid.js** - Works with Solid's reactive system
- ✅ **Vanilla JS** - Direct engine usage without framework overhead
- ✅ **Any Framework** - Just needs a canvas element and lifecycle management

### Integration Pattern

All frameworks follow the same pattern:
1. **Get canvas reference** from DOM
2. **Create Engine2D instance** with canvas
3. **Call engine.start()** to begin
4. **Register update callbacks** for game logic
5. **Cleanup on unmount** with engine.stop()

## 📚 API Reference

### Engine2D Methods
- `start()` - Start engine and game loop
- `stop()` - Stop engine and cleanup
- `onUpdate(callback)` - Register update callback
- `createGameObject(name)` - Create empty GameObject
- `createGameObjectWithPhysics(name, geometry, size)` - Create with physics
- `findGameObject(id)` - Find by ID
- `removeGameObject(obj)` - Remove GameObject

### GameObject Methods
- `addComponent(component)` - Add component
- `removeComponent(name)` - Remove component
- `getComponent(name)` - Get component
- `hasComponent(name)` - Check if has component
- `addChild(child)` - Add child object
- `findChild(name)` - Find direct child
- `destroy()` - Destroy object and cleanup

### Component Methods
- `getName()` - Get component name
- `onAttach(gameObject)` - Called when attached
- `onDetach()` - Called when removed
- `setEnabled(enabled)` - Enable/disable component

### React Hooks
- `useEngine2D(canvasRef)` - Initialize engine with canvas
- `useGameLoop(engine, callback, deps)` - Hook-based game loop

### Vue Composables
- `useEngine2D(canvasRef)` - Initialize engine with manual control
- `useGameLoop(engine, callback, deps)` - Reactive game loop