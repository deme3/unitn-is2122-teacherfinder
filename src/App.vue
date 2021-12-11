<template>
  <header>
    <div id="logo">TeacherFinder</div>
    <Searchbar @search-offer="searchOffer" />
    <Navbar />
  </header>
  <router-view :ads="ads" />
</template>

<script>
import Searchbar from "@/components/Searchbar.vue";
import Navbar from "@/components/Navbar.vue";

export default {
  name: "App",
  components: {
    Navbar,
    Searchbar,
  },
  data() {
    return {
      ads: [],
    };
  },
  methods: {
    searchOffer(searchterms) {
      console.log("Searching for:" + searchterms);
    },
  },
  created() {
    this.ads = [
      { title: "Analisi I", price: 10.5, grading: 1, uuid: "4567876543" },
      {
        title: "Ingegneria del Software I",
        price: 15.344,
        grading: 5,
        uuid: "56788675687",
      },
      {
        title: "Ingegneria del Software I",
        price: 803.22,
        grading: 3,
        uuid: "56768786756768",
      },
      {
        title: "Ingegneria del Software I",
        price: 2.34,
        grading: 5,
        uuid: "4382843",
      },
      {
        title: "Ingegneria del Software I",
        price: 12123.232,
        grading: 2,
        uuid: "43242",
      },
      {
        title: "Ingegneria del Software I",
        price: 232.32,
        grading: 5,
        uuid: "4535453453423",
      },
      {
        title: "Ingegneria del Software I",
        price: 3232.2,
        grading: 1,
        uuid: "92993293",
      },
    ];
  },
};
</script>

<style>
body {
  font: 11pt -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  background: #f1f0e0 url(assets/bg_pattern.png);
}

::selection {
  background-color: #f1f0e0;
}

#logo {
  text-align: center;
  font-size: 24pt;
  margin: 16px;
  cursor: default;
  user-select: none;
}

#app {
  width: clamp(320px, 90%, 1000px);
  margin: 0 auto;
}

.tf-box {
  border: 2px solid black;
  box-shadow: 5px 5px 0 #00000020;
  margin: 16px 8px;
  padding: 16px 24px;
  background: white;
}

.tf-box.hoverable {
  transition: box-shadow 0.1s ease-in-out, transform 0.1s ease-in-out;
}

.tf-box.hoverable:hover {
  box-shadow: 2px 2px 0 #00000020;
  transform: translate(2px, 2px);
  cursor: pointer;
}
</style>
