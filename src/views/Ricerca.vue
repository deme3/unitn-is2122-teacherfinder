<template>
  <div class="ricerca">
    <SmallBox v-if="props.ads.length === 0" />
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

<script setup>
import SearchResult from "@/components/SearchResult.vue"; // @ alias to src
import SmallBox from "@/components/SmallBox.vue";

document.title = "TeacherFinder";
const props = defineProps({
  ads: Array,
});

const offerClick = (id) => {
  console.log("Click of " + id);
};
</script>
