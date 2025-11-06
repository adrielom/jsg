<script setup lang="ts">
import { ref, watch, type PropType } from "vue";
import DefaultComponent from "../defaultComponent.vue";
import type { RigidBodyComponent } from "@/modules/engine2D/components/RigidBodyComponent";

const props = defineProps({
  rigidbody: {
    type: Object as PropType<RigidBodyComponent> | null,
    required: true,
  },
});

const mass = ref(props.rigidbody?.mass ?? 1);
const isKinematic = ref(props.rigidbody?.isKinematic ?? false);
const velocityX = ref(props.rigidbody?.velocity.x ?? 0);
const velocityY = ref(props.rigidbody?.velocity.y ?? 0);
const color = ref(props.rigidbody?.color ?? '#ff6600');

watch(mass, (newMass) => {
  if (props.rigidbody) props.rigidbody.mass = newMass;
});

watch(isKinematic, (newKinematic) => {
  if (props.rigidbody) props.rigidbody.isKinematic = newKinematic;
});

watch([velocityX, velocityY], ([newX, newY]) => {
  if (props.rigidbody) props.rigidbody.velocity = { x: newX, y: newY };
});

watch(color, (newColor) => {
  if (props.rigidbody) props.rigidbody.color = newColor;
});
</script>

<template>
  <DefaultComponent title="RigidBody">
    <div class="property-group">
      <v-text-field
        v-model.number="mass"
        label="Mass"
        type="number"
        step="0.1"
        min="0.001"
        density="compact"
      />
      
      <v-checkbox
        v-model="isKinematic"
        label="Kinematic"
        density="compact"
      />
      
      <div class="velocity-group">
        <label>Velocity</label>
        <div class="velocity-inputs">
          <v-text-field
            v-model.number="velocityX"
            label="X"
            type="number"
            step="0.1"
            density="compact"
          />
          <v-text-field
            v-model.number="velocityY"
            label="Y"
            type="number"
            step="0.1"
            density="compact"
          />
        </div>
      </div>
      
      <v-text-field
        v-model="color"
        label="Color"
        type="color"
        density="compact"
      />
    </div>
  </DefaultComponent>
</template>

<style scoped>
.property-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.velocity-group label {
  font-size: 14px;
  margin-bottom: 4px;
}

.velocity-inputs {
  display: flex;
  gap: 8px;
}
</style>