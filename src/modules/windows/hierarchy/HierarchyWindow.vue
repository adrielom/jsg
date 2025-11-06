<template>
  <div class="hierarchy">
    <h1 class="label">Hierarchy</h1>
    <v-btn class="button" @click="addNewObject"> New Object </v-btn>
    <v-treeview
      class="treeview"
      v-if="items && items.length > 0"
      :items="items"
      selectable
      return-object
      @contextmenu="onRightClick"
      @update:selected="onNodeClick"
    >
      <template v-slot:title="{ item }">
        <v-text-field
          v-if="isRenaming"
          v-model="item.title"
          @update:modelValue="(val: string) => setGOName(val, item.id)"
          @blur="dissmisRenaming"
          @mousedown:enter="dissmisRenaming"
        ></v-text-field>
        <span v-else>{{ item.title }}</span>
        <RightClickMenu
          v-model:menu-position="menuPosition"
          ref="rightClickMenu"
          :item="item"
          :items="menuItems"
        />
      </template>
    </v-treeview>
  </div>
</template>

<script setup lang="ts">
import EnumGeometry from "@/modules/engine2D/enums/EnumGeometry";
import { GameObjectFactory } from "@/modules/engine2D/factories/GameObjectFactory";
import type { GameObject } from "@/modules/engine2D/models/GameObject";
import { Vector2 } from "@/modules/engine2D/models/Vector2";
import { useEngine2D } from "@/shared/stores/engine2D";
import { computed, ref } from "vue";
import type { TreeItem } from "./types";
import RightClickMenu from "../shared/rightClickMenu/RightClickMenu.vue";

const engine = useEngine2D();
import useWindows from "@/shared/stores/windows";

const { hierarchy } = useWindows();
const rightClickMenu = ref<InstanceType<typeof RightClickMenu> | null>(null);
const menuPosition = ref({ x: 0, y: 0 });
const selectedItem = ref<TreeItem | null>(null); // Store the clicked item
const isRenaming = ref(false);

const items = computed(() =>
  engine.engine2D?.tree.elements.map((el) => {
    return {
      id: el.hash,
      title: el.name,
    };
  })
);

const gOFactory = new GameObjectFactory(EnumGeometry.Circle);

const onRightClick = (e: MouseEvent, item: TreeItem) => {
  e.preventDefault(); // Prevent default context menu
  menuPosition.value = { x: e.clientX, y: e.clientY };
  selectedItem.value = item; // Store selected item
  rightClickMenu.value?.openMenu();
};

const dissmisRenaming = () => {
  isRenaming.value = false;
};

const renameItem = () => {
  isRenaming.value = true;
  rightClickMenu.value?.closeMenu();
};

const setGOName = (val: string, id: string) => {
  const selectedGO = engine.engine2D?.tree.elements.find(
    (e) => e.hash === id
  ) as GameObject;
  selectedGO.name = val;
};

const menuItems = computed(() => [
  {
    title: "Rename",
    onClick: renameItem,
  },
  {
    title: "Delete",
    onClick: deleteObject,
  },
]);

const onNodeClick = (e: unknown) => {
  if (!e) return;
  const selectedId = (e as TreeItem[])[0].id;
  const selectedGO = engine.engine2D?.tree.elements.find(
    (e) => e.hash === selectedId
  ) as GameObject;
  hierarchy.setSelected(selectedGO);
};

const deleteObject = () => {
  if (!selectedItem.value) return;
  
  const { engine2D } = engine;
  const success = engine2D?.removeGameObjectById(selectedItem.value.id);
  
  if (success) {
    // Clear selection if deleted object was selected
    const currentSelected = hierarchy.getSelected();
    if (currentSelected?.hash === selectedItem.value.id) {
      hierarchy.setSelected(null);
    }
  }
  
  rightClickMenu.value?.closeMenu();
};

const addNewObject = () => {
  const { engine2D } = engine;
  if (!engine2D) return;
  
  const gO = engine2D.createGameObjectWithPhysics("GameObject", EnumGeometry.Circle, 20);
  const rigidBodyComponent = gO.getComponent("RigidBody");
  rigidBodyComponent?.toggleKinematic();
  gO.Position = new Vector2(400, 350);
};
</script>

<style lang="scss" src="./HierarchyWindow.scss"></style>
