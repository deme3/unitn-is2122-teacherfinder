<template>
  <div class="review-section">
    <h1>Recensioni</h1>
    <Review
      v-for="review in props.reviews"
      :key="review._id"
      :author="review.author"
      :reviewText="review.explanation"
      :rating="review.rating"
    />
  </div>
</template>

<style scoped></style>

<script setup>
import Review from "@/components/Review.vue";
const props = defineProps({
  reviews: Array,
});
</script>
