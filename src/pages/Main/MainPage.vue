<template>
  <div class="main">
    <TreeWindow class="treeWindow" />
    <PlayWindow class="playWindow" />
    <InspectorWindow class="inspectorWindow" />
  </div>
</template>

<script setup lang="ts">
import TreeWindow from "@/modules/windows/tree/TreeWindow.vue";
import PlayWindow from "../../modules/windows/play/PlayWindow.vue";
import InspectorWindow from "@/modules/windows/inspector/InspectorWindow.vue";
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
