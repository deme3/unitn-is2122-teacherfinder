<template>
  <div class="sr-info tf-box" @click="onClick">
    <div class="sr-title">{{ props.title }}</div>
    <div class="sr-price">Prezzo: {{ props.price.toFixed(2) }}€/ora</div>
    <RatingStars :rating="props.rating" />
  </div>
</template>
<style scoped>
.sr-title {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
<script setup>
import { useRouter } from "vue-router";
import RatingStars from "@/components/RatingStars.vue";

const router = useRouter();

const props = defineProps({
  title: String,
  price: Number,
  rating: Number,
  id: String,
});

const emit = defineEmits(["offer-click"]);

const onClick = () => {
  router.push({ name: "Annuncio", params: { id: props.id } });
  emit("offer-click", props.id);
};
</script>

<style scoped>
.sr-info {
  transition: box-shadow 0.1s ease-in-out, transform 0.1s ease-in-out;
}

.sr-info:hover {
  box-shadow: 2px 2px 0 var(--border-unique-shadow);
  transform: translate(2px, 2px);
  cursor: pointer;
}

.sr-info .sr-title {
  font-size: 16pt;
  margin-bottom: 8px;
}
</style>
