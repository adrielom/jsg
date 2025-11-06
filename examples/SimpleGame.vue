<template>
  <div class="simple-game">
    <div class="game-container">
      <canvas ref="gameCanvas" width="800" height="600"></canvas>
      <div class="controls">
        <h3>Simple Game Demo</h3>
        <p>Arrow Keys - Move Player</p>
        <div class="score">Score: {{ score }}</div>
        <v-btn @click="startGame" :disabled="gameRunning">Start Game</v-btn>
        <v-btn @click="stopGame" :disabled="!gameRunning">Stop Game</v-btn>
        <v-btn @click="debugEngine" :disabled="!gameRunning">Debug Engine</v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useEngine2D } from '@/shared/stores/engine2D';
import { EnumGeometry, ComponentRegistry } from '@/modules/engine2D';
import type { RigidBodyComponent } from '@/modules/engine2D/components/RigidBodyComponent';
import type { GameObject } from '@/modules/engine2D/models/GameObject';
import { Vector2 } from '@/modules/engine2D/models/Vector2';
import { Logger, LogLevel } from '@/modules/engine2D/utils/Logger';

const gameCanvas = ref<HTMLCanvasElement>();
const engine = useEngine2D();
const score = ref(0);
const gameRunning = ref(false);

let player: GameObject | null = null;
let enemies: GameObject[] = [];
let unsubscribeUpdate: (() => void) | null = null;

onMounted(() => {
  // Set logger to debug level for detailed logging
  Logger.getInstance().setLogLevel(LogLevel.DEBUG);
  setupControls();
});

onUnmounted(() => {
  if (unsubscribeUpdate) {
    unsubscribeUpdate();
  }
  engine.engine2D?.stop();
});

const initGame = () => {
  const { engine2D } = engine;
  if (!engine2D) return;

  // Create player
  player = engine2D.createGameObjectWithPhysics("Player", EnumGeometry.Circle, 20);
  player.Position = new Vector2(400, 300);
  
  // Add collision detection script to player
  const playerScript = ComponentRegistry.createScript(`
    function update(deltaTime) {
      const rigidBody = gameObject.getComponent("RigidBody");
      const collidingBodies = rigidBody.getCollidingBodies();
      
      if (collidingBodies.length > 0) {
        console.log("Player colliding with", collidingBodies.length, "objects");
      }
    }
  `);
  player.addComponent(playerScript);
  
  // Create enemies
  enemies = [];
  for (let i = 0; i < 5; i++) {
    const enemy = engine2D.createGameObjectWithPhysics("Enemy", EnumGeometry.Rectangle, 30);
    enemy.Position = new Vector2(Math.random() * 800, Math.random() * 600);
    enemies.push(enemy);
  }
};

const startGame = () => {
  if (!gameCanvas.value) {
    console.error('Canvas not ready');
    return;
  }
  
  // Initialize engine with canvas
  engine.setTargetElement(gameCanvas.value);
  engine.start();
  
  if (!engine.engine2D) {
    console.error('Engine not ready');
    return;
  }
  
  gameRunning.value = true;
  score.value = 0;
  initGame();
  
  // Register game update loop
  unsubscribeUpdate = engine.engine2D.onUpdate((deltaTime) => {
    if (!gameRunning.value) return;
    
    // Move enemies in sine wave pattern
    enemies.forEach(enemy => {
      enemy.Position = new Vector2(
        enemy.Position.x + Math.sin(Date.now() * 0.001) * 50 * deltaTime,
        enemy.Position.y
      );
    });
    
    
    // Simple scoring based on time
    score.value = Math.floor(Date.now() / 1000) % 1000;
  });
};

const stopGame = () => {
  gameRunning.value = false;
  if (unsubscribeUpdate) {
    unsubscribeUpdate();
    unsubscribeUpdate = null;
  }
  
  // Clear game objects
  if (engine.engine2D) {
    engine.engine2D.gameObjectManager.clearAllGameObjects();
  }
  player = null;
  enemies = [];
};

const debugEngine = () => {
  if (engine.engine2D) {
    console.log(engine.engine2D.toString());
    
    // Also show recent logs
    const logs = Logger.getInstance().getLogs();
    console.log('\n=== RECENT LOGS ===');
    logs.slice(-20).forEach(log => {
      console.log(`${log.timestamp.toISOString()} [${log.context || 'SYSTEM'}] ${log.message}`);
    });
  }
};



const setupControls = () => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (!player || !gameRunning.value) return;
    
    const speed = 10;
    switch(e.key) {
      case 'ArrowLeft':
        player.Position = new Vector2(player.Position.x - speed, player.Position.y);
        break;
      case 'ArrowRight':
        player.Position = new Vector2(player.Position.x + speed, player.Position.y);
        break;
      case 'ArrowUp':
        player.Position = new Vector2(player.Position.x, player.Position.y - speed);
        break;
      case 'ArrowDown':
        player.Position = new Vector2(player.Position.x, player.Position.y + speed);
        break;
    }
  };
  
  window.addEventListener('keydown', handleKeyPress);
  
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyPress);
  });
};
</script>

<style scoped>
.simple-game {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.game-container {
  display: flex;
  gap: 2rem;
}

canvas {
  border: 2px solid #333;
  background: #000;
}

.controls {
  width: 200px;
}

.controls h3 {
  margin-bottom: 1rem;
}

.controls p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.score {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 1rem 0;
}

.controls button {
  margin: 0.5rem 0;
  width: 100%;
}
</style>