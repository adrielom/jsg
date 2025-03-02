import type { GameObject } from "@/modules/engine2D/models/GameObject";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useHierarchy = defineStore("hierarchy", () => {
  const selected = ref<GameObject | null>(null);
  const setSelected = (value: GameObject | null) => {
    selected.value = value;
  };

  const getSelected = () => selected.value;

  return {
    setSelected,
    getSelected,
  };
});
