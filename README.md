# JSG - JavaScript Game Editor

JSG is a component-based 2D/3D game engine and editor built with TypeScript, Matter.js physics, and framework-agnostic design. Create interactive games with a powerful component system, collision detection, and modern development tools. **3D support with Three.js coming soon!**

## 🎮 Engine Features

- **Component System**: Modular GameObject architecture with Transform, RigidBody, Sprite, and Script components
- **2D Physics Engine**: Built-in Matter.js integration with collision detection
- **3D Support**: Three.js integration for 3D rendering and physics *(coming soon)*
- **Game Loop**: Framework-independent update system with delta time
- **Hierarchy Management**: Parent-child GameObject relationships
- **Collision Detection**: Script-based collision handling with real-time detection
- **Logging & Debugging**: Comprehensive logging system with engine structure visualization
- **Framework Integration**: React hooks and Vue composables for seamless integration
- **Camera System**: Zoom and pan controls with transform-aware sprite rendering
- **Interactive Canvas**: GameObject manipulation with visual feedback

## 🛠 Editor Features

- **Visual Editor**: Hierarchy window for GameObject management
- **Inspector**: Component-based property editing with real-time updates
- **Camera Controls**: Zoom (mouse wheel), pan (Shift+wheel vertical, Alt+wheel horizontal), fine control (Ctrl for slow movement)
- **GameObject Manipulation**: Click and drag GameObjects in the canvas with toggle-able move mode
- **Real-time Preview**: Live game rendering with physics simulation
- **Component Properties**: 
  - **Transform**: Position, rotation, and scale controls
  - **RigidBody**: Mass, kinematic mode, velocity, and color customization
  - **Sprite**: Image URL loading, color tint, opacity, and visibility
- **Vue-Powered Interface**: Modern UI built with Vue 3 and Vuetify
- **TypeScript Support**: Full type safety throughout the engine and editor

## 🚀 Quick Start

### Installation

```sh
# Clone the repository
git clone https://github.com/yourusername/jsg.git

# Navigate to the project directory
cd jsg

# Install dependencies
npm install
```

### Basic Usage

```typescript
import Engine2D, { EnumGeometry, ComponentRegistry } from '@/modules/engine2D';

// Initialize engine
const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
const engine = new Engine2D(canvas);
engine.start();

// Create game objects
const player = engine.createGameObjectWithPhysics("Player", EnumGeometry.Circle, 25);
player.Position = new Vector2(400, 300);

// Add collision detection
const script = ComponentRegistry.createScript(`
  function update(deltaTime) {
    const rigidBody = gameObject.getComponent("RigidBody");
    const collisions = rigidBody.getCollidingBodies();
    
    if (collisions.length > 0) {
      console.log("Collision detected!");
    }
  }
`);
player.addComponent(script);
```

## 📖 Documentation

Comprehensive documentation is available in [`docs/ENGINE_DOCUMENTATION.md`](docs/ENGINE_DOCUMENTATION.md) covering:

- **Component System** - Creating and managing components
- **GameObject Management** - Hierarchy, search, and lifecycle
- **Physics Integration** - Matter.js collision detection
- **Framework Integration** - React hooks and Vue composables
- **API Reference** - Complete method documentation
- **Examples** - Real-world usage patterns

## 🎯 Examples

Check out [`examples/SimpleGame.vue`](examples/SimpleGame.vue) for a complete game implementation featuring:
- Player movement with arrow keys
- Enemy AI with sine wave patterns
- Collision detection between objects
- Component-based architecture
- Real-time physics simulation
- Interactive editor controls
- Camera navigation and object manipulation

## 🛠 Development

### Development Server
```sh
npm run dev
```

### Building for Production
```sh
npm run build
```

### Running Tests
```sh
npm run test:unit
```

### Linting Code
```sh
npm run lint
```

## 🏗 Architecture

### Engine Core
- **Engine2D**: Main engine class with game loop and lifecycle management
- **GameObject**: Component-based game entities with hierarchy support
- **Component System**: Modular functionality (Transform, RigidBody, Sprite, Script)
- **GameObjectManager**: Centralized object creation, search, and management
- **Tree**: Scene graph for efficient object organization
- **RenderFactory**: Canvas rendering with camera controls and sprite system
- **Control Classes**: Modular zoom/pan, drag, and UI controls

### Framework Integration
- **React Hooks**: `useEngine2D`, `useGameLoop` for React applications
- **Vue Composables**: `useEngine2D`, `useGameLoop` for Vue applications
- **Pinia Store**: State management for Vue-based editor interface

### Technologies Used
- **Engine**: TypeScript, Matter.js Physics (2D), Three.js *(3D - coming soon)*, Component Architecture
- **Editor**: Vue 3, Vuetify, Pinia State Management
- **Build Tools**: Vite, ESLint, Vitest
- **Framework Support**: React Hooks, Vue Composables

## 🎮 Game Development Workflow

1. **Create GameObjects** with physics bodies and components
2. **Add Components** (Transform, RigidBody, Sprite, Script) via inspector
3. **Customize Properties** using inspector controls:
   - Transform: Position, rotation, scale
   - RigidBody: Mass, kinematic state, velocity, color
   - Sprite: Image URLs, colors, opacity, visibility
4. **Navigate Scene** with camera controls (zoom/pan)
5. **Position Objects** using drag mode in canvas
6. **Add Scripts** for custom behavior and collision handling
7. **Set up Hierarchy** for complex object relationships
8. **Debug with Logging** to understand engine state and collisions
9. **Export/Import** game scenes and configurations

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Engine Documentation](docs/ENGINE_DOCUMENTATION.md)
- [Simple Game Example](examples/SimpleGame.vue)
- [Component API Reference](src/modules/engine2D/components/)
- [React Hooks](src/modules/engine2D/hooks/)
- [Vue Composables](src/modules/engine2D/composables/)
