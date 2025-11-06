import Engine2D from "@/modules/engine2D/Engine2D";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useEngine2D = defineStore("engine2D", () => {
  const targetElement = ref<HTMLElement | null>(null);
  const engine2D = ref<Engine2D | null>(null);

  const setTargetElement = (element: HTMLElement) => {
    targetElement.value = element;
    engine2D.value = new Engine2D(element);
  };

  const start = (_targetElement?: HTMLElement) => {
    if (_targetElement) {
      setTargetElement(_targetElement);
    }
    if (engine2D.value) {
      engine2D.value.start();
    } else {
      console.error(
        "Engine2D is not initialized. Please set the targetElement."
      );
    }
  };

  return {
    setTargetElement,
    start,
    engine2D,
  };
});
