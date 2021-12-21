<template>
  <div class="tf-box tf-box-err">
    {{ props.text }}
  </div>
</template>

<script setup>
const props = defineProps({
  text: String,
});
</script>

<style scoped>
.tf-box-err {
  box-shadow: none;
  border-color: #ff9595;
  background: #ffd1c9;
  color: #584e49;
}
</style>
