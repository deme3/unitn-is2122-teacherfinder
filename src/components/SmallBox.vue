<template>
  <div class="no-results tf-box">{{ props.default }}</div>
</template>

<style scoped>
.no-results {
  width: fit-content;
  margin: 2em auto;
  font-weight: bold;
}
</style>

<script setup>
const props = defineProps({
  text: {
    default: "Nessun risultato!",
    type: String,
  },
});
</script>
