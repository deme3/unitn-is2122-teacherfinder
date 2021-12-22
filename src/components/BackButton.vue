<template>
  <div class="back-arrow-icon" @click="onClick"></div>
</template>

<style scoped>
.back-arrow-icon {
  display: inline-block;
  width: 32px;
  height: 32px;
  vertical-align: text-bottom;
  background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-arrow-left" width="32" height="32" viewBox="0 0 24 24" stroke-width="2" stroke="black" fill="black" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><line x1="5" y1="12" x2="19" y2="12"></line><line x1="5" y1="12" x2="11" y2="18"></line><line x1="5" y1="12" x2="11" y2="6"></line></svg>');
  background-size: cover;
  background-position: center;
  cursor: pointer;
  filter: var(--icons-filters);
}
</style>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
let prevent = false;

const emit = defineEmits(["backclick"]);

const onClick = function () {
  emit('backclick', function preventDefault() {
    prevent = true;
  });

  // eseguo next tick
  setTimeout(function() {
    if(!prevent) {
      router.back();
    }
  }, 0);
};
</script>
