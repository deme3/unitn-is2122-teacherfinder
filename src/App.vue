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

textarea {
  resize: none;
  font-family: inherit;
  height: 8em;
}

input[type="text"], textarea {
  padding: 8px;
  border: 2px solid black;
  box-shadow: 2px 2px 0 #00000020;
  width: 100%;
  box-sizing: border-box;
  font-size: 11pt;
  outline: none;
  transition: box-shadow 0.1s ease-in-out, transform 0.1s ease-in-out;
}

input[type="text"]:focus, textarea:focus {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0 #00000020;
}

button, input[type=submit] {
  border: 2px solid black;
  background: white;
  box-shadow: 2px 2px 0 #00000020;
  padding: 8px 16px;
  transition: box-shadow 0.1s ease-in-out, transform 0.1s ease-in-out;
}

button:hover, input[type=submit]:hover {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0 #00000020;
  cursor: pointer;
}

button:active, input[type=submit]:active {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0 #00000020;
  cursor: pointer;
}

.edit-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  vertical-align: middle;
  background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 5.5 5.5"><path d="M 0 1 L 1 0 L 5 4 L 4 5 L 0 1 M 5.5 5.5 L 5.25 4.25 L 4.25 5.25 L 5.5 5.5" fill="black"></path></svg>');
  background-size: cover;
}
</style>
