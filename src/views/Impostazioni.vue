<template>
  <h1>Impostazioni</h1>
  <div class="impostazioni tf-box">
    <UserCard v-bind="props.userInfo" />
    <TextEntry description="Nickname" v-model:text="form.nickname" />
    <TextEntry
      description="Biografia"
      v-model:text="form.biography"
      multiline
    />

    <h2>Notifiche</h2>
    <section class="notifications">
      <ToggleEntry
        v-model:toggle="form.notifications.ricevuta"
        description="Richiesta insegnamento ricevuta da studente"
      />
      <ToggleEntry
        v-model:toggle="form.notifications.annullata"
        description="Richiesta insegnamento annullata da studente"
      />
      <ToggleEntry
        v-model:toggle="form.notifications.pagamentoOK"
        description="Pagamento insegnamento effettuato da studente"
      />
      <ToggleEntry
        v-model:toggle="form.notifications.concluso"
        description="Uno studente ha segnalato che l'insegnamento è stato portato a termine"
      />
      <ToggleEntry
        v-model:toggle="form.notifications.accettato"
        description="Un tutor ha accettato la richiesta di insegnamento"
      />
      <ToggleEntry
        v-model:toggle="form.notifications.rifiutato"
        description="Un tutor ha rifiutato la richiesta di insegnamento"
      />
    </section>
    <section class="action-buttons">
      <button @click="logout">Logout</button>
      <button @click="cancelEdits">Annulla modifiche</button>
      <button @click="saveEdits" :disabled="settingsModified">Salva</button>
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

.action-buttons :disabled {
  opacity: 0.5;
}
</style>

<script setup>
import { reactive, watch, computed } from "vue";
import UserCard from "@/components/UserCard.vue";
import TextEntry from "@/components/TextEntry.vue";
import ToggleEntry from "@/components/ToggleEntry.vue";

document.title = "TeacherFinder – Impostazioni";

const props = defineProps({
  ads: Array,
  userInfo: {
    firstName: String,
    lastName: String,
    nickname: String,
    biography: String,
    notifications: String,
  },
});

// Qua andrà una richiesta alla REST api
// Per le info del profilo utente
const original = reactive({
  nickname: props.userInfo.nickname,
  biography: props.userInfo.biography,
  notifications: {
    ricevuta: false,
    annullata: false,
    pagamentoOK: false,
    concluso: false,
    accettato: false,
    rifiutato: false,
  },
});

const form = reactive({
  nickname: props.userInfo.nickname,
  biography: props.userInfo.biography,
  notifications: { ...original.notifications },
});

watch(
  () => props.userInfo.nickname,
  () => {
  original.nickname = props.userInfo.nickname;
  form.nickname = props.userInfo.nickname;
});

watch(
  () => props.userInfo.biography,
  () => {
  original.biography = props.userInfo.biography;
  form.biography = props.userInfo.biography;
});

watch(
  () => props.userInfo.notifications,
  () => {
    Object.assign(original.notifications, notificationsStringToFormObject(
      props.userInfo.notifications
    ));
    Object.assign(form.notifications, notificationsStringToFormObject(
      props.userInfo.notifications
    ));
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
  form.biography = original.biography;
  form.notifications = { ...original.notifications };
};

const saveEdits = async () => {
  // REST api salvataggio modifiche
  let query = {
    sessionToken: props.userInfo.sessionToken,
    updates: {},
  };
  if (hasChanged("nickname")) query.updates.nickname = form.nickname;
  if (hasChanged("biography")) query.updates.biography = form.biography;
  if (haveNotificationsChanged())
    query.updates.notifications = notificationsString(form.notifications);

  let saveResults = await fetch("/api/settings/change", {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(query),
  });

  if (saveResults !== null) {
    let res = await saveResults.json();
    console.log(res);

    if (res.acknowledged && res.modifiedCount >= 1) {
      window.location.reload();
      // Non posso aggiornare le prop, quindi aggiorno per ricaricare tutto
    }
  }
};

const notificationsString = (formObject) => {
  let str = "";
  for (let notification of Object.values(formObject))
    str += (notification ? 1 : 0);
  
  return str;
};

const notificationsStringToFormObject = (str) => {
  if(typeof str === "undefined") return "000000";
  return {
    ricevuta: str[0] == "1",
    annullata: str[1] == "1",
    pagamentoOK: str[2] == "1",
    concluso: str[3] == "1",
    accettato: str[4] == "1",
    rifiutato: str[5] == "1",
  };
};

const hasChanged = (fieldName) => {
  return form[fieldName] != original[fieldName];
};

const haveNotificationsChanged = () => {
  return (
    notificationsString(form.notifications) !=
    notificationsString(original.notifications)
  );
}

const settingsModified = computed(() => {
  return !(
    hasChanged("nickname") ||
    hasChanged("biography") ||
    haveNotificationsChanged()
  );
});
</script>
