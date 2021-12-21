<template>
  <div class="signup-view">
    <h1>Registrati</h1>
    <div class="tf-box" v-if="!showRegistrazioneCompletata">
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
          <ErrorBox v-if="errorBox.isVisible" :text="errorBox.text" />
        </div>
        <div class="register-btn-wrapper"><button>Registrati</button></div>
      </form>
    </div>
    <SmallBox
      v-if="showRegistrazioneCompletata"
      text="Registrazione completata!"
    />
  </div>
</template>

<style scoped>
h1 {
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
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import TextEntry from "@/components/TextEntry.vue";
import ErrorBox from "@/components/ErrorBox.vue";
import SmallBox from "@/components/SmallBox.vue";

const router = useRouter();

document.title = "TeacherFinder – Registrati";
const form = reactive({
  firstName: "",
  lastName: "",
  nickname: "",
  password: "",
  email: "",
  biography: "",
});
const passRepeat = ref("");

const errorBox = reactive({
  isVisible: false,
  text: "Errore",
  showText: (text) => {
    errorBox.text = text;
    errorBox.isVisible = true;
  },
});

const showRegistrazioneCompletata = ref(false);
const submitSignUp = async () => {
  if (
    form.firstName === "" ||
    form.lastName === "" ||
    form.nickname === "" ||
    form.password === "" ||
    form.email === ""
  ) {
    console.log("[!] Campi mancanti");

    errorBox.showText("Ups, alcuni campi sono vuoti.");
    return;
  }

  if (form.password != passRepeat.value) {
    console.log("[!] Le password non combaciano");

    errorBox.showText("Oops, le password non combaciano.");
    return;
  }

  // Qua ci va la REST api
  console.log(`/api/user/register\n`, "Registrazione: ", { ...form });
  const resp = await fetch(`/api/user/register`, {
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
    showRegistrazioneCompletata.value = true;
    setTimeout(() => {
      router.push({ name: "Login" });
    }, 2000);
  } else {
    console.log(
      `[${resp.status}] Errore nella registrazione!\n`,
      await resp.text()
    );
    errorBox.showText(
      "Esite già un utente con quel nome utente o quella email. Usa un nome utente o un'email diversa."
    );
  }
};
</script>
