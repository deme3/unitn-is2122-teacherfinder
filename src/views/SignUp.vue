<template>
  <div class="SignUp tf-box">
    <div class="register-title">Registrati</div>
    <form method="post" @submit.prevent="submitSignUp">
      <div class="register-header">
        <TextEntry v-model:text="form.firstName" description="Nome" />
        <TextEntry v-model:text="form.lastName" description="Cognome" />
        <TextEntry v-model:text="form.nickname" description="Nickname" />
        <TextEntry v-model:text="form.email" description="E-mail" />
        <TextEntry
          v-model:text="form.biography"
          :multiline="true"
          description="Biografia"
        />
        <TextEntry
          v-model:text="form.password"
          description="Password"
          password
        />
        <TextEntry
          v-model:text="passRepeat"
          description="Ripeti password"
          password
        />
      </div>
      <div class="register-btn-wrapper"><button>Registrati</button></div>
    </form>
  </div>
</template>

<style scoped>
.register-title {
  text-align: center;
}

.register-header {
  border-bottom: 2px solid var(--border-unique-color);
  margin-bottom: 1em;
}
.register-btn-wrapper {
  text-align: right;
}
</style>

<script setup>
import { reactive, ref, inject } from "vue";
import TextEntry from "@/components/TextEntry.vue";

const url = inject("apiBaseURL");

const form = reactive({
  firstName: "",
  lastName: "",
  nickname: "",
  password: "",
  email: "",
  biography: "",
});
const passRepeat = ref("");

const submitSignUp = async () => {
  if (form.password != passRepeat.value) {
    console.log("Le password non combaciano");
    alert("Le password non combaciano");
    return;
  }

  // Qua ci va la REST api
  console.log("Registrazione: ", { ...form });
  console.log(`${url}/api/user/register`);
  const resp = await fetch(`${url}/api/user/register`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });

  if (resp.ok) {
    console.log("La registrazione è andata a buon fine!");
    console.log(await resp.json());
  } else {
    console.log(`[${resp.status}] Errore nella registrazione!`);
    console.log(await resp.text());
  }
};
</script>
