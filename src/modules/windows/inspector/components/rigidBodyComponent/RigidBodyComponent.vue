<script setup lang="ts">
import { ref, type PropType } from "vue";
import DefaultComponent from "../defaultComponent.vue";
import type { RigidBody2D } from "@/modules/engine2D/models/RigidBody2D";

const props = defineProps({
  rigidbody: {
    type: Object as PropType<RigidBody2D> | null,
    required: true,
  },
});

const isStatic = ref<boolean | null>(props.rigidbody.isKinematic());

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
