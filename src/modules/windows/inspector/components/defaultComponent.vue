<template>
  <h3>{{ title }}</h3>
  <slot></slot>
</template>

<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>
