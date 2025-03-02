import { Tree } from "@/modules/engine2D/models/Tree";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useEngine2D } from "./engine2D";
import type Engine2D from "@/modules/engine2D/Engine2D";

export const useTree = defineStore("tree", () => {
  const engine = useEngine2D();
  const engine2D = engine.engine2D as Engine2D;
  const tree = ref<Tree | null>(new Tree(engine2D));

  return {
    tree,
  };
});
