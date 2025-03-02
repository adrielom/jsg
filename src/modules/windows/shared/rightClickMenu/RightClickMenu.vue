<template>
  <v-menu
    class="wrapper"
    v-model="menuVisible"
    :close-on-content-click="false"
    :style="{
      left: `${menuPosition.x}px`,
      top: `${menuPosition.y}px`,
      position: 'absolute',
    }"
  >
    <v-list class="list">
      <v-list-item
        v-for="(item, index) in items"
        :key="index"
        @click="() => items[index].onClick(target)"
      >
        {{ item.title }}
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { ref, defineProps, type PropType } from "vue";
import type { RightClickMenu } from "./types";

const menuVisible = ref(false);

const menuPosition = defineModel("menuPosition", {
  default: { x: 0, y: 0 },
});

defineProps({
  items: {
    type: Array as PropType<Array<RightClickMenu>>,
    required: true,
  },
  target: {
    type: Object as PropType<RightClickMenu> | null,
    required: false,
  },
});

const openMenu = () => {
  menuVisible.value = true;
};

const closeMenu = () => {
  menuVisible.value = false;
};

defineExpose({
  menuVisible,
  openMenu,
  closeMenu,
});
</script>
