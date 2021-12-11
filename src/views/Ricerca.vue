<template>
  <div class="ricerca">
    <SearchResult
      v-for="ad in ads"
      :key="ad.uuid"
      :uuid="ad.uuid"
      :title="ad.title"
      :price="ad.price"
      :grading="ad.grading"
      @offer-click="offerClick"
    />
  </div>
</template>

<script>
// @ is an alias to /src
import SearchResult from "@/components/SearchResult.vue";

export default {
  name: "Ricerca",
  components: { SearchResult },
  props: { ads: Array },
  methods: {
    offerClick(uuid) {
      console.log("Click of " + uuid);
    },
  },
};
</script>
