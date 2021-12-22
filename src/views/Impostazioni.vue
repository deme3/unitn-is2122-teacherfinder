<template>
  <div>
    <h1>Impostazioni</h1>
    <div class="impostazioni tf-box">
      <UserCard v-bind="userInfo" />
      <ErrorBox :text="errorBox.text" v-if="errorBox.isVisible" />
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
        <button @click="cancelEdits" :disabled="settingsModified">
          Annulla modifiche
        </button>
        <button @click="saveEdits" :disabled="settingsModified">Salva</button>
      </section>
    </div>
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
import { reactive, computed, inject } from "vue";
import ErrorBox from "@/components/ErrorBox.vue";
import UserCard from "@/components/UserCard.vue";
import TextEntry from "@/components/TextEntry.vue";
import ToggleEntry from "@/components/ToggleEntry.vue";

document.title = "TeacherFinder – Impostazioni";
const userInfo = reactive(inject("userInfo"));
console.log(userInfo);

const notificationsString = (formObject) => {
  let str = "";
  for (let notification of Object.values(formObject))
    str += notification ? 1 : 0;

  return str;
};

const errorBox = reactive({
  isVisible: false,
  text: "Errore",
  showText: (text) => {
    errorBox.text = text;
    errorBox.isVisible = true;
  },
});

const notificationsStringToFormObject = (str) => {
  if (typeof str === "undefined")
    return notificationsStringToFormObject("000000");
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
  return form[fieldName] != userInfo[fieldName];
};

const form = reactive({
  nickname: userInfo.nickname,
  biography: userInfo.biography,
  notifications: {
    ...notificationsStringToFormObject(userInfo.notifications),
  },
});

function loadSettings() {
  if (userInfo.nickname !== "") form.nickname = userInfo.nickname;
  if (userInfo.biography !== "") form.biography = userInfo.biography;
  if (typeof userInfo.notifications?.rifiutato !== "undefined")
    Object.assign(
      form.notifications,
      notificationsStringToFormObject(userInfo.notifications)
    );
}

const logout = async () => {
  console.log("logout");
  // Qua andrà una richiesta alla REST api
  // Per il logout
  let logoutResult = await fetch(`/api/user/logout/${userInfo.sessionToken}`, {
    method: "DELETE",
  });

  if (logoutResult.ok) {
    let logoutJSON = await logoutResult.json();

    if (logoutJSON.deletedCount.deletedCount == 1) {
      document.cookie =
        "sessionToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict";
      window.location.replace("/");
    }
  }
};

const cancelEdits = () => {
  form.nickname = userInfo.nickname;
  form.biography = userInfo.biography;
  form.notifications = {
    ...notificationsStringToFormObject(userInfo.notifications),
  };
};

const saveEdits = async () => {
  // REST api salvataggio modifiche
  let query = {
    sessionToken: userInfo.sessionToken,
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

  if (!saveResults?.ok) {
    try {
      let res = await saveResults.json();
      console.log(res);
      if (res.error === "DUPLICATE_ENTRY")
        errorBox.showText("Il nickname che hai inserito non è disponibile.");
    } catch (e) {
      errorBox.showText("Errore nel salvataggio delle impostazioni.");
      console.log(saveResults.text);
    }
    return;
  }

  let res = await saveResults.json();
  console.log(res);

  if (res.acknowledged && res.modifiedCount >= 1) {
    if (query.updates.nickname) userInfo.nickname = query.updates.nickname;
    if (query.updates.biography) userInfo.biography = query.updates.biography;
    if (query.updates.notifications)
      userInfo.notifications = query.updates.notifications;
  }
};

const haveNotificationsChanged = () => {
  return notificationsString(form.notifications) != userInfo.notifications;
};

const settingsModified = computed(() => {
  console.log(userInfo.nickname, form.nickname);
  console.log(userInfo.biography, form.biography);
  console.log(userInfo.notifications, form.notifications);
  return !(
    hasChanged("nickname") ||
    hasChanged("biography") ||
    haveNotificationsChanged()
  );
});

loadSettings();
</script>
