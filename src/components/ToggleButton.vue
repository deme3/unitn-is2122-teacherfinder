<template>
  <div class="toggle-button">
    <div class="toggle-dot-container">
      <div :class="toggleDotClass"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";

const props = defineProps({
  toggle: Boolean,
});

const emit = defineEmits(["update:toggle"]);
let toggleStatus = computed({
  get: () => props.toggle,
  set: (val) => emit("update:toggle", val),
});

const toggleDotClass = ref(
  "toggle-dot" + (toggleStatus.value ? " toggled" : "")
);

const toggle = () => {
  toggleStatus.value = !toggleStatus.value;
};

watch(toggleStatus, () => {
  toggleDotClass.value = "toggle-dot" + (toggleStatus.value ? " toggled" : "");
});

defineExpose({ toggleStatus: Boolean, toggle });
</script>

<style scoped>
.toggle-button {
  border: 2px solid var(--border-unique-strongcolor);
  background: var(--elements-bg-color);
  width: 32px;
  height: 16px;
  padding: 2px;
  cursor: pointer;
}

.toggle-dot-container {
  position: relative;
}

.toggle-dot {
  position: absolute;
  background: var(--border-unique-strongcolor);
  right: 16px;
  width: 16px;
  height: 16px;
  transition: right 0.05s ease-out;
}

.toggled.toggle-dot {
  right: 0;
  transition: right 0.05s ease-out;
}
</style>
