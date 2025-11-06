# Game Object Management Examples

This document shows how to use the enhanced game object management system in JSG.

## Basic Game Object Operations

### Creating Game Objects

```typescript
import { useEngine2D } from '@/shared/stores/engine2D';
import { EnumGeometry } from '@/modules/engine2D';

const engine = useEngine2D();
const { engine2D } = engine;

// Create empty game object
const emptyObject = engine2D.createGameObject("MyObject");

// Create game object with physics
const physicsObject = engine2D.createGameObjectWithPhysics(
  "PhysicsObject", 
  EnumGeometry.Circle, 
  25
);
```

### Finding Game Objects

```typescript
// Find by ID
const gameObject = engine2D.findGameObject("some-uuid");

// Find by name
const namedObject = engine2D.findGameObjectByName("MyObject");

// Search with pattern
const matchingObjects = engine2D.searchGameObjects("Player.*");

// Find objects with specific component
const objectsWithRigidBody = engine2D.gameObjectManager.findGameObjectsWithComponent("RigidBody");
```

### Removing Game Objects

```typescript
// Remove by reference
engine2D.removeGameObject(gameObject);

// Remove by ID
engine2D.removeGameObjectById("some-uuid");

// Remove by name
engine2D.gameObjectManager.removeGameObjectByName("MyObject");
```

## Component Management

### Adding Components

```typescript
import { ComponentRegistry } from '@/modules/engine2D';

const gameObject = engine2D.createGameObject("TestObject");

// Add sprite component
const sprite = ComponentRegistry.createSprite(null, "#ff0000");
gameObject.addComponent(sprite);

// Add script component
const script = ComponentRegistry.createScript(`
  console.log('Hello from', gameObject.name);
`);
gameObject.addComponent(script);

// Add rigid body component
const rigidBody = ComponentRegistry.createRigidBody('circle', 20);
gameObject.addComponent(rigidBody);
```

### Managing Components

```typescript
// Check if component exists
if (gameObject.hasComponent("RigidBody")) {
  console.log("Object has physics");
}

// Get component
const transform = gameObject.getComponent("Transform");
if (transform) {
  transform.position = { x: 100, y: 100 };
}

// Remove component
gameObject.removeComponent("Script");

// Get all components
const allComponents = gameObject.getAllComponents();
console.log("Components:", allComponents.map(c => c.getName()));
```

## Hierarchy Management

### Parent-Child Relationships

```typescript
const parent = engine2D.createGameObject("Parent");
const child = engine2D.createGameObject("Child");

// Set parent-child relationship
parent.addChild(child);

// Find child by name
const foundChild = parent.findChild("Child");

// Find child recursively
const deepChild = parent.findChildRecursive("DeepChild");

// Remove from parent
parent.removeChild(child);
```

### Using GameObjectManager

```typescript
const manager = engine2D.gameObjectManager;

// Set parent by ID
manager.setParentById("child-id", "parent-id");

// Remove parent (set to null)
manager.setParentById("child-id", null);
```

## Advanced Operations

### Duplicating Objects

```typescript
const original = engine2D.createGameObjectWithPhysics("Original", EnumGeometry.Rectangle);
const duplicate = engine2D.gameObjectManager.duplicateGameObject(original);
```

### Batch Operations

```typescript
// Get all objects
const allObjects = engine2D.gameObjectManager.getAllGameObjects();

// Clear all objects
engine2D.gameObjectManager.clearAllGameObjects();

// Get count
const count = engine2D.gameObjectManager.getGameObjectCount();
```

### Component Registry

```typescript
// Get available component types
const availableComponents = ComponentRegistry.getAvailableComponents();

// Register custom component
class CustomComponent extends Component {
  getName() { return "Custom"; }
}
ComponentRegistry.register("Custom", CustomComponent);

// Create component by name
const customComponent = ComponentRegistry.create("Custom");
```

## Integration with UI

The hierarchy window and inspector automatically reflect these changes:

- **Hierarchy Window**: Shows all game objects in a tree view
- **Inspector Window**: Shows components of selected object
- **Right-click Menu**: Provides delete and rename options
- **Add Component**: Dropdown to add new components to selected object

## Best Practices

1. **Use meaningful names** for game objects
2. **Group related objects** using parent-child relationships  
3. **Remove unused components** to keep objects lightweight
4. **Use the manager methods** for complex operations
5. **Check for null** when finding objects by ID or name