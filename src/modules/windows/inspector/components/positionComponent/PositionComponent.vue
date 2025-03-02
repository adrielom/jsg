<script setup lang="ts">
import { Vector2 } from "@/modules/engine2D/models/Vector2";
import DefaultComponent from "../defaultComponent.vue";

const emits = defineEmits(["change"]);

const model = defineModel<number[]>({ default: [0, 0] as number[] });
const axisNames = Object.getOwnPropertyNames(new Vector2(0, 0));

const onUpdateValue = (value: string, index: number) => {
  model.value[index] = Number(value);
  emits("change", model.value);
};
</script>

<template>
  <DefaultComponent title="Position">
    <div class="axis" v-for="(axisName, index) in axisNames" :key="index">
      <v-text-field
        :id="axisName"
        type="number"
        :label="axisName"
        v-model.number="model[index] as number"
        @update:model-value="(e) => onUpdateValue(e, index)"
      ></v-text-field>
    </div>
  </DefaultComponent>
</template>

<style lang="scss" scoped>
.axis {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: baseline;

  .axisLabel {
    font-size: 2rem;
  }
}
</style>
