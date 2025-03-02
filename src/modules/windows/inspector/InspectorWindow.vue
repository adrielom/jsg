<template>
  <div class="section" v-if="selectedGO">
    <h1>Inspector</h1>
    <h2 class="title">name: {{ selectedGO?.name }}</h2>
    <PositionComponent v-model="selectedGOPosition" @change="setPosition" />
  </div>
</template>

<script lang="ts" setup>
import useWindows from "@/shared/stores/windows";
import { computed } from "vue";
import PositionComponent from "./components/positionComponent/PositionComponent.vue";
import { Vector2 } from "@/modules/engine2D/models/Vector2";

const { hierarchy } = useWindows();
const selectedGO = computed(() => hierarchy.getSelected());
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
