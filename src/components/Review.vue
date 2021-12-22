<template>
  <div class="review tf-box">
    <div
      class="author"
      @click="
        $router.push({ name: 'Profilo', params: { userId: props.author._id } })
      "
    >
      <div class="img-and-name">
        <img src="https://picsum.photos/50" />
        <h2 style="display: inline">
          {{ author.firstName }} {{ author.lastName }}
        </h2>
      </div>
      <RatingStars :rating="props.rating" />
    </div>
    <p v-if="explanation">
      {{ explanation }}
    </p>
  </div>
</template>

<style scoped>
.author {
  cursor: pointer;
  gap: 1rem;
  display: flex;
  align-content: center;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
}

img {
  width: 50px;
  height: 50px;
  border-radius: 100%;
  margin-right: 10px;
}

p {
  word-wrap: break-word;
  white-space: pre-line;
}

.img-and-name > * {
  vertical-align: middle;
}

.author {
  vertical-align: middle;
}
</style>

<script setup>
import RatingStars from "@/components/RatingStars.vue";

const props = defineProps({
  author: {
    _id: "",
    firstName: "Caricamento...",
    lastName: "",
    nickname: "",
  },
  explanation: String,
  rating: Number,
});
</script>
