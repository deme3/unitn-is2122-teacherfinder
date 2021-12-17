<template>
  <div class="tf-box">
    <form method="post" @submit.prevent="submitLogin">
      <div class="login-header">Login</div>
      <TextEntry v-model:text="loginData.nickname" description="Username o E-mail" />
      <TextEntry v-model:text="loginData.password" description="Password" password />
      <ToggleEntry v-model:toggle="loginData.remember" description="Ricordami" />
      <div class="input-wrapper">
        <button type="button" @click.prevent="$router.push({ name: 'SignUp' })">
          Registrati
        </button>
        <input type="submit" value="Login" />
      </div>
    </form>
  </div>
</template>

<style scoped>
.login-header {
  text-align: center;
}

.input-wrapper {
  display: flex;
  justify-content: space-between;
}
</style>

<script setup>
import { reactive, getCurrentInstance } from "vue";
import TextEntry from "@/components/TextEntry.vue";
import ToggleEntry from "@/components/ToggleEntry.vue";

const app = getCurrentInstance();

const loginData = reactive({
  nickname: "",
  password: "",
  remember: false,
});
const apiURL = app.appContext.config.globalProperties.$apiBaseURL();

const submitLogin = async () => {
  const res = await (
    await fetch(apiURL + "/user/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nickname: loginData.nickname,
        password: loginData.password,
      }),
    })
  ).json();

  if (typeof res._id !== "undefined") {
    if (loginData.remember) {
      // Cookie persistente: Durata cookie di 12 mesi (espressa in secondi)
      document.cookie = `sessionToken=${res._id}; Max-Age=${60 * 60 * 24 * 30 * 12}`;
    } else {
      // Session cookie: Scade quando termina la sessione del browser
      document.cookie = `sessionToken=${res._id}`;
    }
    window.location.replace("/");
  }
};
</script>
