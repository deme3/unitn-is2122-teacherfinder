<template>
  <h1>Impostazioni</h1>
  <div class="impostazioni tf-box">
    <UserCard />
    <TextSettingsEntry description="Nickname" default-value="framcesca" />
    <TextSettingsEntry
      description="Biografia"
      default-value="Vuoto"
      multiline
    />

    <h2>Notifiche</h2>
    <section class="notifications">
      <ToggleSettingsEntry
        description="Richiesta insegnamento ricevuta da studente"
      />
      <ToggleSettingsEntry
        description="Richiesta insegnamento annullata da studente"
      />
      <ToggleSettingsEntry
        description="Pagamento insegnamento effettuato da studente"
      />
      <ToggleSettingsEntry
        description="Uno studente ha segnalato che l'insegnamento è stato portato a termine"
      />
      <ToggleSettingsEntry
        description="Un tutor ha accettato la richiesta di insegnamento"
      />
      <ToggleSettingsEntry
        description="Un tutor ha rifiutato la richiesta di insegnamento"
      />
    </section>
    <section class="action-buttons">
      <button @click="logout">Logout</button>
      <button>Annulla modifiche</button>
      <button>Salva</button>
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
}

.action-buttons button:first-child {
  margin-right: auto;
}
</style>

<script setup>
import UserCard from "@/components/UserCard.vue";
import TextSettingsEntry from "@/components/TextSettingsEntry.vue";
import ToggleSettingsEntry from "@/components/ToggleSettingsEntry.vue";

const logout = () => {
  console.log("logout");
  document.cookie =
    "sessionToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  window.location.replace("/");
};
</script>

<script>
export default {
  inheritAttrs: false,
};
</script>
