<template>
  <h1>Impostazioni</h1>
  <div class="impostazioni tf-box">
    <UserCard />
    <TextEntry description="Nickname" v-model:text="form.nickname" />
    <TextEntry description="Biografia" v-model:text="form.bio" multiline />

    <h2>Notifiche</h2>
    <section class="notifications">
      <ToggleEntry
        v-model:toggle="form.notifiche.ricevuta"
        description="Richiesta insegnamento ricevuta da studente"
      />
      <ToggleEntry
        v-model:toggle="form.notifiche.annullata"
        description="Richiesta insegnamento annullata da studente"
      />
      <ToggleEntry
        v-model:toggle="form.notifiche.pagamentoOK"
        description="Pagamento insegnamento effettuato da studente"
      />
      <ToggleEntry
        v-model:toggle="form.notifiche.concluso"
        description="Uno studente ha segnalato che l'insegnamento è stato portato a termine"
      />
      <ToggleEntry
        v-model:toggle="form.notifiche.accettato"
        description="Un tutor ha accettato la richiesta di insegnamento"
      />
      <ToggleEntry
        v-model:toggle="form.notifiche.rifiutato"
        description="Un tutor ha rifiutato la richiesta di insegnamento"
      />
    </section>
    <section class="action-buttons">
      <button @click="logout">Logout</button>
      <button @click="cancelEdits">Annulla modifiche</button>
      <button @click="saveEdits">Salva</button>
    </section>
  </div>
</template>

<style scoped>
.notifications {
  margin-bottom: 2em;
}

.action-buttons {
  display: flex;
  gap: 1em;
  justify-content: right;
  flex-wrap: wrap;
}

.action-buttons button:first-child {
  margin-right: auto;
}
</style>

<script setup>
import { reactive } from "vue";
import UserCard from "@/components/UserCard.vue";
import TextEntry from "@/components/TextEntry.vue";
import ToggleEntry from "@/components/ToggleEntry.vue";

// Qua andrà una richiesta alla REST api
// Per le info del profilo utente
const original = {};
original.nickname = "framcesca";
original.bio = "Biografia di framcesca";
original.notifiche = {
  ricevuta: false,
  annullata: false,
  pagamentoOK: false,
  concluso: false,
  accettato: false,
  rifiutato: false,
};

const form = reactive({
  nickname: original.nickname,
  bio: original.bio,
  notifiche: { ...original.notifiche },
});

const logout = async () => {
  console.log("logout");
  // Qua andrà una richiesta alla REST api
  // Per il logout
  document.cookie =
    "sessionToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict";
  window.location.replace("/");
};

const cancelEdits = () => {
  form.nickname = original.nickname;
  form.bio = original.bio;
  form.notifiche = { ...original.notifiche };
};

const saveEdits = () => {
  // REST api salvataggio modifiche
};
</script>

<script>
export default {
  inheritAttrs: false,
};
</script>
