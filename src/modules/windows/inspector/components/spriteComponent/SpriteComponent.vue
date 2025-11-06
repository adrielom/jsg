<script setup lang="ts">
import { ref, watch, type PropType } from "vue";
import DefaultComponent from "../defaultComponent.vue";
import type { SpriteComponent } from "@/modules/engine2D/components/SpriteComponent";

const props = defineProps({
  sprite: {
    type: Object as PropType<SpriteComponent> | null,
    required: true,
  },
});

const imageUrl = ref(props.sprite?.imageUrl ?? "");
const color = ref(props.sprite?.color ?? "#ffffff");
const opacity = ref(props.sprite?.opacity ?? 1);
const visible = ref(props.sprite?.visible ?? true);

watch(imageUrl, (newUrl) => {
  if (props.sprite) props.sprite.imageUrl = newUrl;
});

watch(color, (newColor) => {
  if (props.sprite) props.sprite.color = newColor;
});

watch(opacity, (newOpacity) => {
  if (props.sprite) props.sprite.opacity = newOpacity;
});

watch(visible, (newVisible) => {
  if (props.sprite) props.sprite.visible = newVisible;
});
</script>

<template>
  <DefaultComponent title="Sprite">
    <div class="property-group">
      <v-text-field
        v-model="imageUrl"
        label="Image URL"
        placeholder="https://example.com/image.png"
        density="compact"
      />
      
      <v-text-field
        v-model="color"
        label="Color"
        type="color"
        density="compact"
      />
      
      <v-slider
        v-model="opacity"
        label="Opacity"
        min="0"
        max="1"
        step="0.1"
        thumb-label
        density="compact"
      />
      
      <v-checkbox
        v-model="visible"
        label="Visible"
        density="compact"
      />
    </div>
  </DefaultComponent>
</template>

<style scoped>
.property-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>