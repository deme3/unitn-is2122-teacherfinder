<template>
  <div class="text-settings-entry">
    <div class="description">{{ props.description }}</div>
    <textarea v-if="multiline" v-model="value" />
    <input v-else-if="!multiline && password" type="password" v-model="value" />
    <input
      v-else-if="!multiline && !password && numeric"
      type="number"
      v-model="value"
    />
    <input v-else type="text" v-model="value" />
  </div>
</template>

<style scoped>
.text-settings-entry {
  margin-bottom: 1.5em;
}

input {
  color: var(--font-color);
  background-color: var(--text-box-bg-color);
}

textarea {
  color: var(--font-color);
  background: var(--text-box-bg-color);
}

.description {
  font-weight: bold;
  margin: 0.5em 0;
}
</style>

<script setup>
import { computed } from "vue";

const props = defineProps({
  description: String,
  text: String,
  number: Number,
  multiline: Boolean,
  password: Boolean,
  numeric: Boolean,
});

const emit = defineEmits(["update:text", "update:number"]);

const value = computed({
  get: () => props?.text || props?.number,
  set: (val) => {
    if (props?.numeric) emit("update:number", val);
    else emit("update:text", val);
  },
});
</script>
