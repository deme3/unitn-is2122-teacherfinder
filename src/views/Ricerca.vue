<template>
  <div class="ricerca">
    <SearchResult
      v-for="ad in props.ads"
      :key="ad.uuid"
      :uuid="ad.uuid"
      :title="ad.title"
      :price="ad.price"
      :grading="ad.grading"
      @offer-click="offerClick"
    />
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import SearchResult from "@/components/SearchResult.vue"; // @ alias to src

const props = defineProps({
  ads: Array,
});

const offerClick = (uuid) => {
  console.log("Click of " + uuid);
};
</script>
