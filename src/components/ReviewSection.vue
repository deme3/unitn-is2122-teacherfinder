<template>
  <div class="review-section">
    <h1>{{ props.title }}</h1>
    <NoResults v-if="props.reviews.length === 0" />
    <Review
      v-for="review in props.reviews"
      :key="review._id"
      :author="review.author"
      :explanation="review.explanation"
      :rating="review.rating"
    />
  </div>
</template>

<style scoped></style>

<script setup>
import Review from "@/components/Review.vue";
import NoResults from "@/components/NoResults.vue";
const props = defineProps({
  title: {
    type: String,
    default: "Recensioni",
  },
  reviews: Array,
});
</script>
