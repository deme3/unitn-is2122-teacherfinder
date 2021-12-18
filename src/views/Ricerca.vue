<template>
  <div class="ricerca">
    <div class="no-results tf-box" v-if="props.ads.length === 0">Nessun risultato!</div>
    <SearchResult
      v-for="ad in props.ads"
      :key="ad._id"
      :uuid="ad._id"
      :title="ad.title"
      :price="ad.price"
      :grading="ad.grading"
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

const props = defineProps({
  ads: Array,
});

const offerClick = (uuid) => {
  console.log("Click of " + uuid);
};
</script>
