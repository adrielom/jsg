<script setup lang="ts">
import { ref, type PropType } from "vue";
import DefaultComponent from "../defaultComponent.vue";
import type { RigidBodyComponent } from "@/modules/engine2D/components/RigidBodyComponent";

const props = defineProps({
  rigidbody: {
    type: Object as PropType<RigidBodyComponent> | null,
    required: true,
  },
});

const isStatic = ref<boolean | null>(props.rigidbody?.isKinematic() ?? false);

console.log(props.rigidbody);
</script>

<template>
  <DefaultComponent title="Rigidbody">
    <div>
      <v-checkbox
        v-model="isStatic"
        color="success"
        label="success"
        @click="() => (isStatic = !isStatic)"
        hide-details
      ></v-checkbox>
    </div>
  </DefaultComponent>
</template>
