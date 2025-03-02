<template>
  <div class="section">
    <h1>Inspector</h1>
    <div class="content" v-if="selectedGO">
      <h2 class="title">name: {{ selectedGO?.name }}</h2>
      <PositionComponent v-model="selectedGOPosition" @change="setPosition" />
      <RigidBodyComponent :rigidbody="rigidBody" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import useWindows from "@/shared/stores/windows";
import { computed } from "vue";
import PositionComponent from "./components/positionComponent/PositionComponent.vue";
import { Vector2 } from "@/modules/engine2D/models/Vector2";
import RigidBodyComponent from "./components/rigidBodyComponent/RigidBodyComponent.vue";
import type { RigidBody2D } from "@/modules/engine2D/models/RigidBody2D";

const { hierarchy } = useWindows();
const selectedGO = computed(() => hierarchy.getSelected());
const rigidBody = computed(() => selectedGO?.value?.rigidBody as RigidBody2D);
const selectedGOPosition = computed(() =>
  Object.values(selectedGO.value!.Position)
);

const setPosition = (values: number[]) => {
  if (selectedGO.value) {
    const [x, y] = values;
    selectedGO.value.Position = new Vector2(x, y);
  }
};
</script>

<style lang="scss" scoped>
.section {
  margin: 1rem;
}
</style>
