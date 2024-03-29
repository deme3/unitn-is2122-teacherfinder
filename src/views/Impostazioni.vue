<template>
  <div>
    <h1>Impostazioni</h1>
    <div class="impostazioni tf-box">
      <UserCard v-bind="userInfo" />
      <ErrorBox ref="errorBox" />
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
        <button @click="cancelEdits" :disabled="actionDisabled">
          Annulla modifiche
        </button>
        <button @click="saveEdits" :disabled="actionDisabled">Salva</button>
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
</style>

<script setup>
import { reactive, computed, inject, ref } from "vue";
import ErrorBox from "@/components/ErrorBox.vue";
import UserCard from "@/components/UserCard.vue";
import TextEntry from "@/components/TextEntry.vue";
import ToggleEntry from "@/components/ToggleEntry.vue";

const errorBox = ref(null); // ErrorBox component
document.title = "TeacherFinder – Impostazioni";
const userInfo = reactive(inject("userInfo"));
console.log(userInfo);

const notificationsString = (formObject) => {
  let str = "";
  for (let notification of Object.values(formObject))
    str += notification ? 1 : 0;

  return str;
};

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

  if (!logoutResult.ok) {
    console.log("Errore durante il logout", await logoutResult.text());

    // Probabilmente non l'utente si è sloggato in un'altra sessione
    if (logoutResult.status == 404) {
      window.location.replace("/");
      document.cookie =
        "sessionToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict";
    }
    return;
  }

  let logoutJSON = await logoutResult.json();

  if (logoutJSON.deletedCount.deletedCount == 1) {
    document.cookie =
      "sessionToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict";
    window.location.replace("/");
  }
};

const cancelEdits = () => {
  form.nickname = userInfo.nickname;
  form.biography = userInfo.biography;
  form.notifications = {
    ...notificationsStringToFormObject(userInfo.notifications),
  };

  errorBox.value.hide();
};

const saveEdits = async () => {
  // REST api salvataggio modifiche
  let query = {
    sessionToken: userInfo.sessionToken,
    updates: {},
  };
  if (hasChanged("nickname")) {
    if (form.nickname.length < 3) {
      errorBox.value.showText("Il nickname che hai scelto è troppo corto.");
      return;
    }

    query.updates.nickname = form.nickname;
  }
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

  if (!saveResults.ok) {
    switch (saveResults.status) {
      case 400: // BAD REQUEST
        errorBox.value.showText("I campi che hai inserito non sono validi.");
        break;
      case 403: // FORBIDDEN
        errorBox.value.showText(
          "Oh no! La tua sessione ha un problema, prova a loggarti di nuovo."
        );
        break;
      case 500: // SERVER ERROR
        try {
          let res = await saveResults.json();
          console.log(res);
          if (res.error === "DUPLICATE_ENTRY")
            errorBox.value.showText(
              "Ops, Il nickname che hai inserito non è disponibile."
            );
        } catch (e) {
          errorBox.value.showText(
            "Errore del server durante il salvataggio delle impostazioni."
          );
          console.log(await saveResults.text);
        }
    }
    return;
  }

  // TUTTO OK
  let res = await saveResults.json();
  console.log(res);

  if (res.acknowledged && res.modifiedCount >= 1) {
    if (query.updates.nickname) userInfo.nickname = query.updates.nickname;
    if (query.updates.biography) userInfo.biography = query.updates.biography;
    if (query.updates.notifications)
      userInfo.notifications = query.updates.notifications;

    errorBox.value.hide();
  } else {
    errorBox.value.showText("Errore nel salvataggio delle impostazioni.");
  }
};

const haveNotificationsChanged = () => {
  return notificationsString(form.notifications) != userInfo.notifications;
};

const actionDisabled = computed(() => {
  return (
    !(
      hasChanged("nickname") ||
      hasChanged("biography") ||
      haveNotificationsChanged()
    ) ||
    form.biography.trim() == "" ||
    form.nickname.trim() == ""
  );
});

loadSettings();
</script>
