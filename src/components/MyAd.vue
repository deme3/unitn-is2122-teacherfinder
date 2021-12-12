<template>
  <div class="my-ad tf-box hoverable">
    <div class="title">{{ props.title }}</div>
    <div class="price">Prezzo: {{ prettyPrice }}€/ora</div>
    <div class="description">{{ props.description }}</div>
    <div class="enrolments">
      <div class="active">{{ activeEnrolments }} iscritti</div>
      <div class="pending">{{ pendingEnrolments }} richieste in attesa</div>
    </div>
  </div>
</template>

<style scoped>
.my-ad .title {
  font-size: 16pt;
}

.my-ad .enrolments {
  display: flex;
  margin-top: 16px;
}

.my-ad .enrolments > div {
  width: 50%;
  text-align: center;
}
</style>

<script setup>
import { computed, defineProps } from "vue";

const props = defineProps({
  title: String,
  price: Number,
  description: String,
});

const prettyPrice = computed(() => props.price.toFixed(2));
const enrolments = computed(() => 17);
const activeEnrolments = computed(() => 9);
const pendingEnrolments = computed(
  () => enrolments.value - activeEnrolments.value
);
</script>
