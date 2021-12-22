<template>
  <div class="login-view">
    <h1>Login</h1>
    <div class="tf-box">
      <ErrorBox
        text="Attenzione, il nome utente o la password non sembrano essere corretti.
        Se non possiedi ancora un account, prova a registrarti."
        ref="errorBox"
      />
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
import ErrorBox from "@/components/ErrorBox.vue";

document.title = "TeacherFinder – Login";
const loginForm = reactive({
  nickname: "",
  password: "",
});

const rememberLogin = ref(false);

const errorBox = ref(null);
const submitLogin = async () => {
  const resp = await fetch(`/api/user/login`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...loginForm, persistent: rememberLogin.value }),
  });

  let respObj = {};

  if (resp.ok) {
    console.log("Il login è andato a buon fine!");
    respObj = await resp.json();
    console.log(respObj);
  } else {
    console.log(
      `[${resp.status}] Errore durante il login!\n`,
      await resp.text()
    );
    errorBox.value.show();
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
