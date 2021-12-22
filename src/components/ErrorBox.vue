<template>
  <div :class="'tf-box ' + 'tf-box-err ' + animClass" v-if="isShown">
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
const animClass = ref("");

const hide = () => (isShown.value = false);
const show = () => {
  isShown.value = true;
  if (animClass.value !== "animate") {
    animClass.value = "animate";
    setTimeout(() => (animClass.value = ""), 300);
  }
};

const showText = (txt) => {
  text.value = txt;
  show();
};

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

.animate {
  animation: myAnim 300ms ease 0s 1 normal forwards;
}

@keyframes myAnim {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}
</style>
