<template>
  <div class="sr-info tf-box" @click="onClick">
    <div class="sr-title">{{ props.title }}</div>
    <div class="sr-price">Prezzo: {{ prettyPrice }}€/ora</div>
    <div :class="ratingClass">
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
      <div class="star"></div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  title: String,
  price: Number,
  rating: Number,
  id: String,
});

const emit = defineEmits(["offer-click"]);

const ratingClass = computed(() => {
  return "sr-grading star-" + props.rating;
});
const prettyPrice = computed(() => {
  return props.price.toFixed(2);
});

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

.sr-grading {
  margin-top: 10px;
}

.star {
  width: 16px;
  height: 16px;
  background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-star" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="gold" fill="gold" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"></path><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" fill="gold"></path></svg>');
  background-size: cover;
  display: inline-block;
  margin: 0 4px;
}

.star:first-child {
  margin-left: 0;
}

.sr-grading.star-0 .star {
  display: none;
}

.sr-grading.star-0:after {
  content: "Nessuna valutazione";
  vertical-align: top;
  line-height: 1.1em;
  color: goldenrod;
}

.sr-grading.star-1 .star:not(:first-child),
.sr-grading.star-2 .star:not(:first-child, :nth-child(2)),
.sr-grading.star-3 .star:not(:first-child, :nth-child(2), :nth-child(3)),
.sr-grading.star-4 .star:nth-child(4),
.sr-grading .star-4 .star:last-child {
  opacity: 0.2;
}
</style>
