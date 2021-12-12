<template>
  <header>
    <div id="logo">
      <div id="logo-text">TeacherFinder</div>
      <div id="user-info">
        <div id="user-login" v-if="this.sessionToken === ''">
          <button @click.prevent="this.$router.push({ name: 'Login' })">
            Login
          </button>
        </div>
      </div>
    </div>
    <Searchbar @search-offer="searchOffer" />
    <Navbar />
  </header>
  <router-view :ads="this.ads" />
</template>

<script setup>
import Searchbar from "@/components/Searchbar.vue";
import Navbar from "@/components/Navbar.vue";
import { ref, defineExpose } from "vue";

const ads = ref([]);
const sessionToken = ref("");

const searchOffer = async function (searchterms) {
  console.log("Searching for: " + searchterms);
  /* ads.value = await fetch(
    "http://localhost:8080/search?" +
      new URLSearchParams({
        keyword: searchterms,
      })
  ); */
};

const getCookie = function (name) {
  var match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  if (match) return match[2];
  else return "";
};

sessionToken.value = getCookie("sessionToken");

ads.value = [
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

defineExpose({
  ads,
  sessionToken,
});
</script>

<style>
@media (prefers-color-scheme: dark) {
  /* Dark theme styles go here */
  :root {
    --bg-color: #141414;
    --font-color: #d7dadc;
    --text-box-bg-color: #242323;
    --elements-bg-color: #2a2929;
    --border-unique-color: #c6c6c6;
    --border-unique-shadow: #00000020;
    --bg-uri: url(assets/bg_pattern_dark.png);
  }
}

@media (prefers-color-scheme: light) {
  /* Light theme styles go here */
  :root {
    --bg-color: #f1f0e0;
    --font-color: #000000;
    --text-box-bg-color: white;
    --elements-bg-color: #ffffff;
    --border-unique-color: #000000;
    --border-unique-shadow: #00000020;
    --bg-uri: url(assets/bg_pattern.png);
  }
}

body {
  font: 11pt -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  background: var(--bg-color) var(--bg-uri);
  color: var(--font-color);
  background-attachment: fixed;
}

::selection {
  background-color: var(--bg-color);
}

#logo {
  text-align: center;
  font-size: 24pt;
  margin: 16px 0;
  cursor: default;
  user-select: none;
  display: flex;
}

#logo #logo-text {
  width: 100%;
}

#app {
  width: clamp(320px, 90%, 1000px);
  margin: 0 auto;
}

.tf-box {
  border: 2px solid var(--border-unique-color);
  box-shadow: 5px 5px 0 var(--border-unique-shadow);
  margin: 16px 8px;
  padding: 16px 24px;
  background: var(--elements-bg-color);
}

.tf-box.hoverable {
  transition: box-shadow 0.1s ease-in-out, transform 0.1s ease-in-out;
}

.tf-box.hoverable:hover {
  box-shadow: 2px 2px 0 var(--border-unique-shadow);
  transform: translate(2px, 2px);
  cursor: pointer;
}

textarea {
  resize: none;
  font-family: inherit;
  height: 8em;
}

input[type="text"],
input[type="password"],
textarea {
  padding: 8px;
  border: 2px solid var(--border-unique-color);
  box-shadow: 2px 2px 0 var(--border-unique-shadow);
  width: 100%;
  box-sizing: border-box;
  font-size: 11pt;
  outline: none;
  transition: box-shadow 0.1s ease-in-out, transform 0.1s ease-in-out;
}

input[type="text"]:focus,
input[type="password"]:focus,
textarea:focus {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0 var(--border-unique-shadow);
}

button,
input[type="submit"] {
  border: 2px solid var(--border-unique-color);
  color: var(--font-color);
  background: var(--elements-bg-color);
  box-shadow: 2px 2px 0 var(--border-unique-shadow);
  padding: 8px 16px;
}

button:hover,
input[type="submit"]:hover {
  transition: box-shadow 0.1s ease-in-out, transform 0.1s ease-in-out;
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0 var(--border-unique-shadow);
  cursor: pointer;
}

button:active,
input[type="submit"]:active {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0 var(--border-unique-shadow);
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
