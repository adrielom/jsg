<template>
  <div ref="playWindow"></div>
</template>

<script setup lang="ts">
import { useEngine2D } from "@/shared/stores/engine2D";
import { onMounted, ref } from "vue";

const playWindow = ref(null);
const engine = useEngine2D();

onMounted(async () => {
  engine.start(playWindow.value! as HTMLElement);
});
</script>
