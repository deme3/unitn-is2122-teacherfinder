<template>
  <header>
    <div id="logo">
      <div></div>
      <div id="logo-text">TeacherFinder</div>
      <div id="user-info">
        <div id="user-login" v-if="sessionToken === '' && showLoginBtn">
          <button @click.prevent="$router.push({ name: 'Login' })">
            Login
          </button>
        </div>
      </div>
    </div>
    <Searchbar @search-offer="searchOffer" />
    <Navbar v-if="sessionToken" />
  </header>
  <router-view
    :ads="ads"
    v-if="
      (getCookie('sessionToken') !== '' && userInfo._id !== '') ||
      getCookie('sessionToken') == ''
    "
  />
</template>

<script>
import Searchbar from "@/components/Searchbar.vue";
import Navbar from "@/components/Navbar.vue";

import { defineComponent, ref, reactive, watch, provide } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  components: { Searchbar, Navbar },
  setup() {
    const route = useRoute();

    const ads = ref([]);
    const sessionToken = ref("");
    const userInfo = reactive({
      _id: "",
      firstName: "",
      lastName: "",
      nickname: "",
      email: "",
      biography: "",
      sessionToken: "",
    });
    provide("userInfo", userInfo);

    const searchOffer = async function (searchterms) {
      console.log("Searching for: " + searchterms);
      let searchResults = await fetch(
        `/api/ads/search/${encodeURIComponent(searchterms)}`
      );
      if (searchResults.ok) ads.value = await searchResults.json();
    };

    const getCookie = function (name) {
      var match = document.cookie.match(
        new RegExp("(^| )" + name + "=([^;]+)")
      );
      if (match) return match[2];
      else return "";
    };

    sessionToken.value = getCookie("sessionToken");

    if (sessionToken.value.trim() !== "") {
      fetch(`/api/user/checkToken/${sessionToken.value}`).then(async (res) => {
        if (res.status == 200) {
          let resJSON = await res.json();

          if (resJSON.exists && !resJSON.error && !resJSON.expired) {
            Object.assign(userInfo, resJSON.profile);
            userInfo.sessionToken = sessionToken.value;
          } else {
            document.cookie = "sessionToken=;Max-Age=0";
          }
        }
      });
    }

    const showLoginBtn = ref(true);
    watch(
      () => route.name,
      (toParams, previousParams) => {
        console.log(`Nav: ${previousParams} > ${toParams}`);
        if (toParams == "Login") showLoginBtn.value = false;
        else showLoginBtn.value = true;
      }
    );

    // Mostra tutti gli annunci nel db
    searchOffer(" ");

    return {
      searchOffer,
      sessionToken,
      showLoginBtn,
      ads,
      userInfo,
      getCookie,
    };
  },
});
</script>

<style>
:root {
  color-scheme: light dark;
  --base-font: 11pt -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
    "Segoe UI Symbol";
  --toggle-active-color: #00b87cb5;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

@media (prefers-color-scheme: dark) {
  /* Dark theme styles go here */
  :root {
    --bg-color: #141414;
    --font-color: #d7dadc;
    --text-box-bg-color: #242323;
    --elements-bg-color: #2a2929;
    --border-unique-color: #8a8a8a;
    --border-unique-strongcolor: #c6c6c6;
    --border-unique-shadow: #00000020;
    --bg-uri: url(assets/bg_pattern_dark.png);
    --icons-filters: invert(100%) brightness(0.85);
  }
}

@media (prefers-color-scheme: light) {
  /* Light theme styles go here */
  :root {
    --bg-color: #f1f0e0;
    --font-color: #000000;
    --text-box-bg-color: white;
    --elements-bg-color: #ffffff;
    --border-unique-color: #8a8a8a;
    --border-unique-strongcolor: #000000;
    --border-unique-shadow: #00000020;
    --bg-uri: url(assets/bg_pattern.png);
    --icons-filters: none;
  }
}

body {
  font: var(--base-font);
  background: var(--bg-color) var(--bg-uri);
  color: var(--font-color);
  background-attachment: fixed;
}

::selection {
  background-color: var(--bg-color);
}

#logo {
  font-size: 24pt;
  margin: 16px 0;
  cursor: default;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 40px;
}

#logo > div {
  flex: 1 0 0;
}

.flex > span:nth-child(2) {
  text-align: center;
}

#user-login {
  display: flex;
  justify-content: right;
}

#logo #logo-text {
  width: 100%;
}

#app {
  width: clamp(300px, 99%, 600px);
  margin: 0 auto;
}

.tf-box {
  border: 2px solid var(--border-unique-color);
  box-shadow: 5px 5px 0 var(--border-unique-shadow);
  margin: 16px 8px;
  padding: 16px 24px;
  background: var(--elements-bg-color);
  border-radius: 2px;
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
input[type="number"],
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
input[type="number"]:focus,
textarea:focus {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0 var(--border-unique-shadow);
}

button,
input[type="submit"] {
  -webkit-appearance: none;
  font: var(--base-font);
  border: 2px solid var(--border-unique-strongcolor);
  color: var(--font-color);
  background: var(--elements-bg-color);
  box-shadow: 2px 2px 0 var(--border-unique-shadow);
  padding: 8px 16px;
}

button:not(:disabled):hover,
input[type="submit"]:not(:disabled):hover {
  transition: box-shadow 0.1s ease-in-out, transform 0.1s ease-in-out;
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0 var(--border-unique-shadow);
  cursor: pointer;
}

button:not(:disabled):active,
input[type="submit"]:not(:disabled):active {
  transition: box-shadow 0s, transform 0s;
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0 var(--border-unique-shadow);
  cursor: pointer;
}

@media (hover: none) {
  button:not(:disabled):hover,
  input[type="submit"]:not(:disabled):hover {
    transition: none;
    -webkit-transition: none;
    transform: none;
    -webkit-transform: none;
  }

  button:not(:disabled):active,
  input[type="submit"]:not(:disabled):active {
    transform: translate(1px, 1px);
  }
}

.edit-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  vertical-align: middle;
  background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 5.5 5.5"><path d="M 0 1 L 1 0 L 5 4 L 4 5 L 0 1 M 5.5 5.5 L 5.25 4.25 L 4.25 5.25 L 5.5 5.5" fill="black"></path></svg>');
  background-size: cover;
}

select,
textarea,
input[type="text"],
input[type="password"],
input[type="datetime"],
input[type="datetime-local"],
input[type="date"],
input[type="month"],
input[type="time"],
input[type="week"],
input[type="number"],
input[type="email"],
input[type="url"],
input[type="search"],
input[type="tel"],
input[type="color"] {
  font-size: 16px;
  border-color: var(--border-unique-strongcolor);
  -webkit-appearance: none;
  border-radius: 5px;
}

input {
  -webkit-appearance: none;
  border-radius: 0;
}
</style>
