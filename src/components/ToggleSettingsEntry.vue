<template>
  <div class="toggle-settings-entry">
    <div class="description">{{ props.description }}</div>
    <div class="toggle"><ToggleButton ref="togglebutton" /></div>
  </div>
</template>

<style scoped>
.toggle-settings-entry {
  display: flex;
  justify-content: center;
}

.toggle-settings-entry .description {
  width: 100%;
}

.toggle-settings-entry .toggle {
  width: 48px;
}

.toggle-settings-entry .toggle .toggle-button {
  margin: 0 auto;
}

.toggle {
  margin-left: 1em;
  margin-top: auto;
  margin-bottom: auto;
}

.toggle-settings-entry:not(:last-child) {
  border-bottom: 2px solid var(--border-unique-color);
  margin-bottom: 1em;
  padding-bottom: 1em;
}
</style>

<script setup>
import ToggleButton from "@/components/ToggleButton.vue";
import { defineProps, computed, ref, defineExpose } from "vue";

const props = defineProps({
  description: String,
});

const togglebutton = ref(null);

const toggleStatus = computed(() => {
  if (togglebutton.value == null) return false;
  return togglebutton.value.toggleStatus;
});

defineExpose({
  toggleStatus: toggleStatus,
});
</script>
