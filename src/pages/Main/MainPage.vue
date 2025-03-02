<template>
  <div class="main">
    <HierarchyWindow class="treeWindow" />
    <PlayWindow class="playWindow" />
    <InspectorWindow class="inspectorWindow" />
  </div>
</template>

<script setup lang="ts">
import HierarchyWindow from "@/modules/windows/hierarchy/HierarchyWindow.vue";
import InspectorWindow from "@/modules/windows/inspector/InspectorWindow.vue";
import PlayWindow from "../../modules/windows/play/PlayWindow.vue";
</script>

<style lang="scss">
.main {
  display: flex;
  flex-direction: row;
  height: 100vh;

  .treeWindow,
  .playWindow,
  .inspectorWindow {
    flex: 0.33;
  }
}
</style>
