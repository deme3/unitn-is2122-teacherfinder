<template>
  <div class="review tf-box">
    <div class="author" @click="$router.push({ name: 'Profilo', params: { userId: props.author._id } });">
      <img src="https://picsum.photos/50" />
      <h2 style="display: inline">{{ author.firstName }} {{ author.lastName }}</h2>
    </div>
    <p>
      {{ reviewText }}
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
}

.author > img {
  width: 50px;
  height: 50px;
  border-radius: 100%;
}
</style>

<script setup>
const props = defineProps({
  author: {
    _id: "",
    firstName: "Caricamento...",
    lastName: "",
    nickname: "",
  },
  reviewText: String,
});
</script>