<template>
  <div class="ricerca">
    <div class="no-results tf-box" v-if="props.ads.length === 0">Nessun risultato!</div>
    <SearchResult
      v-for="ad in props.ads"
      :key="ad._id"
      :id="ad._id"
      :title="ad.title"
      :price="ad.price"
      :rating="ad.rating"
      @offer-click="offerClick"
    />
  </div>
</template>

<style scoped>
.no-results {
  width: fit-content;
  margin: 2em auto;
  font-weight: bold;
}
</style>

<script setup>
import SearchResult from "@/components/SearchResult.vue"; // @ alias to src
document.title = "TeacherFinder";
const props = defineProps({
  ads: Array,
});

const offerClick = (id) => {
  console.log("Click of " + id);
};
</script>
