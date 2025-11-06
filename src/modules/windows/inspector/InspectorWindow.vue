<template>
  <div class="section">
    <h1>Inspector</h1>
    <div class="content" v-if="selectedGO">
      <h2 class="title">{{ selectedGO?.name }}</h2>
      
      <!-- Components List -->
      <div class="components-section">
        <h3>Components</h3>
        
        <!-- Transform Component -->
        <div class="component-item" v-if="transformComponent">
          <div class="component-header">
            <span>Transform</span>
          </div>
          <PositionComponent v-model="selectedGOPosition" @change="setPosition" />
        </div>
        
        <!-- RigidBody Component -->
        <div class="component-item" v-if="rigidBody">
          <div class="component-header">
            <span>RigidBody</span>
            <v-btn size="small" @click="removeComponent('RigidBody')">Remove</v-btn>
          </div>
          <RigidBodyComponent :rigidbody="rigidBodyComponent" />
        </div>
        
        <!-- Other Components -->
        <div 
          v-for="component in otherComponents" 
          :key="component.hash"
          class="component-item"
        >
          <div class="component-header">
            <span>{{ component.getName() }}</span>
            <v-btn size="small" @click="removeComponent(component.getName())">Remove</v-btn>
          </div>
          <div class="component-content">
            <!-- Component-specific UI would go here -->
            <p>{{ component.getName() }} Component</p>
          </div>
        </div>
      </div>
      
      <!-- Add Component Section -->
      <div class="add-component-section">
        <h3>Add Component</h3>
        <v-select
          v-model="selectedComponentType"
          :items="availableComponents"
          label="Component Type"
          density="compact"
        ></v-select>
        <v-btn @click="addComponent" :disabled="!selectedComponentType">Add Component</v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import useWindows from "@/shared/stores/windows";
import { computed, ref } from "vue";
import PositionComponent from "./components/positionComponent/PositionComponent.vue";
import { Vector2 } from "@/modules/engine2D/models/Vector2";
import RigidBodyComponent from "./components/rigidBodyComponent/RigidBodyComponent.vue";
import type { RigidBodyComponent as RigidBodyComp } from "@/modules/engine2D/components/RigidBodyComponent";
import { ComponentRegistry } from "@/modules/engine2D/registry/ComponentRegistry";
import type { TransformComponent } from "@/modules/engine2D/components/TransformComponent";
import type { RigidBodyComponent as RigidBodyComp } from "@/modules/engine2D/components/RigidBodyComponent";

const { hierarchy } = useWindows();
const selectedGO = computed(() => hierarchy.getSelected());
const selectedComponentType = ref<string | null>(null);

// Component getters
const transformComponent = computed(() => 
  selectedGO.value?.getComponent<TransformComponent>("Transform")
);



const rigidBodyComponent = computed(() => 
  selectedGO.value?.getComponent<RigidBodyComp>("RigidBody")
);

const otherComponents = computed(() => {
  if (!selectedGO.value) return [];
  return selectedGO.value.getAllComponents().filter(
    component => !['Transform', 'RigidBody'].includes(component.getName())
  );
});

const availableComponents = computed(() => {
  if (!selectedGO.value) return [];
  return ComponentRegistry.getAvailableComponents().filter(
    name => name !== 'Transform' && !selectedGO.value!.hasComponent(name)
  );
});

const selectedGOPosition = computed(() => {
  if (!selectedGO.value) return [0, 0];
  return Object.values(selectedGO.value.Position);
});

const setPosition = (values: number[]) => {
  if (selectedGO.value) {
    const [x, y] = values;
    selectedGO.value.Position = new Vector2(x, y);
  }
};

const addComponent = () => {
  if (!selectedGO.value || !selectedComponentType.value) return;
  
  let component;
  switch (selectedComponentType.value) {
    case 'RigidBody':
      component = ComponentRegistry.createRigidBody();
      break;
    case 'Sprite':
      component = ComponentRegistry.createSprite();
      break;
    case 'Script':
      component = ComponentRegistry.createScript();
      break;
    default:
      component = ComponentRegistry.create(selectedComponentType.value);
  }
  
  if (component) {
    selectedGO.value.addComponent(component);
    selectedComponentType.value = null;
  }
};

const removeComponent = (componentName: string) => {
  if (!selectedGO.value) return;
  selectedGO.value.removeComponent(componentName);
};
</script>

<style lang="scss" scoped>
.section {
  margin: 1rem;
}

.components-section {
  margin: 1rem 0;
}

.component-item {
  border: 1px solid #ddd;
  border-radius: 4px;
  margin: 0.5rem 0;
  padding: 0.5rem;
}

.component-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.component-content {
  padding: 0.5rem 0;
}

.add-component-section {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}
</style>
