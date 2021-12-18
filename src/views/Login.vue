<template>
  <div class="tf-box">
    <form method="post" @submit.prevent="submitLogin">
      <div class="login-header">Login</div>
      <TextEntry
        v-model:text="loginForm.nickname"
        description="Username o E-mail"
      />
      <TextEntry
        v-model:text="loginForm.password"
        description="Password"
        password
      />
      <ToggleEntry v-model:toggle="rememberLogin" description="Ricordami" />
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
import { reactive, inject, ref } from "vue";
import TextEntry from "@/components/TextEntry.vue";
import ToggleEntry from "@/components/ToggleEntry.vue";

const url = inject("apiBaseURL");

const loginForm = reactive({
  nickname: "",
  password: "",
});

const rememberLogin = ref(false);

const submitLogin = async () => {
  const resp = await fetch(`${url}/api/user/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...loginForm }),
  });

  let respObj = {};

  if (resp.ok) {
    console.log("La registrazione è andata a buon fine!");
    respObj = await resp.json();
    console.log(respObj);
  } else {
    console.log(
      `[${resp.status}] Errore nella registrazione!\n`,
      await resp.text()
    );
    return;
  }

  if (typeof respObj?.error == "undefined") {
    if (rememberLogin.value) {
      // Cookie persistente: Durata cookie di 12 mesi (espressa in secondi)
      document.cookie = `sessionToken=${resp._id}; Max-Age=${
        60 * 60 * 24 * 30 * 12
      }; SameSite=Strict;`;
    } else {
      // Session cookie: Scade quando termina la sessione del browser
      document.cookie = `sessionToken=${resp._id}; SameSite=Strict;`;
    }
    window.location.replace("/");
  }
};
</script>
