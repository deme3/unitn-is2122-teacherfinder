<template>
  <div class="tf-box tf-box-err" v-if="isShown">
    {{ text }}
  </div>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps({
  text: {
    type: String,
    default: "Errore generico.",
  },
});

const isShown = ref(false);
const text = ref(props.text);

const showText = (txt) => {
  text.value = txt;
  isShown.value = true;
};

const hide = () => (isShown.value = false);
const show = () => (isShown.value = true);

const isVisible = () => isShown.value;

defineExpose({
  showText,
  hide,
  show,
  isVisible,
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
