<template>
  <div class="login-view">
    <h1>Login</h1>
    <div class="tf-box">
      <form method="post" @submit.prevent="submitLogin">
        <TextEntry v-model:text="loginForm.nickname" description="Username" />
        <TextEntry
          v-model:text="loginForm.password"
          description="Password"
          password
        />
        <ToggleEntry v-model:toggle="rememberLogin" description="Ricordami" />
        <div class="input-wrapper">
          <button
            type="button"
            @click.prevent="$router.push({ name: 'SignUp' })"
          >
            Registrati
          </button>
          <input type="submit" value="Login" />
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
h1 {
  text-align: center;
}

.input-wrapper {
  display: flex;
  justify-content: space-between;
}
</style>

<script setup>
import { reactive, ref } from "vue";
import TextEntry from "@/components/TextEntry.vue";
import ToggleEntry from "@/components/ToggleEntry.vue";

document.title = "TeacherFinder – Login";
const loginForm = reactive({
  nickname: "",
  password: "",
});

const rememberLogin = ref(false);

const submitLogin = async () => {
  const resp = await fetch(`/api/user/login`, {
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

  if (typeof respObj?._id != "undefined") {
    if (rememberLogin.value) {
      // Cookie persistente: Durata cookie di 12 mesi (espressa in secondi)
      document.cookie = `sessionToken=${respObj._id}; Max-Age=${
        60 * 60 * 24 * 30 * 12
      }; SameSite=Strict;`;
    } else {
      // Session cookie: Scade quando termina la sessione del browser
      document.cookie = `sessionToken=${respObj._id}; SameSite=Strict;`;
    }
    window.location.replace("/");
  }
};
</script>
