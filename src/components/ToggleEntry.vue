<template>
  <div class="toggle-entry" @click="onClick">
    <div class="description">{{ props.description }}</div>
    <div class="toggle"><ToggleButton v-model:toggle="toggleStatus" /></div>
  </div>
</template>

<style scoped>
.toggle-entry {
  display: flex;
  justify-content: center;
}

.toggle-entry .description {
  width: 100%;
  user-select: none;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none;
}

.toggle-entry .toggle {
  width: 48px;
}

.toggle-entry .toggle .toggle-button {
  margin: 0 auto;
}

.toggle {
  margin-left: 1em;
  margin-top: auto;
  margin-bottom: auto;
}

.toggle-entry:not(:last-child) {
  border-bottom: 2px solid var(--border-unique-color);
  margin-bottom: 1em;
  padding-bottom: 1em;
}
</style>

<script setup>
import ToggleButton from "@/components/ToggleButton.vue";
import { computed } from "vue";

const props = defineProps({
  description: {
    type: String,
    default: "Default description",
  },
  toggle: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:toggle"]);
const toggleStatus = computed({
  get: () => props.toggle,
  set: (val) => emit("update:toggle", val),
});

const onClick = () => {
  toggleStatus.value = !toggleStatus.value;
};
</script>
