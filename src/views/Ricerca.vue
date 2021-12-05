<template>
  <div class="ricerca">
    <SearchResult
      v-for="ad in ads"
      :key="ad.uuid"
      :title="ad.title"
      :price="ad.price"
      :grading="ad.grading"
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
  computed: {
    gradingClass: function () {
      return "ad-grading star-" + this.grading;
    },
    prettyPrice: function () {
      return this.price.toFixed(2);
    },
  },
  methods: {},
};
</script>
