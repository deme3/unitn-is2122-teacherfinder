<template>
  <div class="impostazioni tf-box">
    <h1>Impostazioni</h1>
    <UserCard />
    <TextSettingsEntry description="Nickname" default-value="deme3" />
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
  text-align: right;
}

.action-buttons button:not(:last-child) {
  margin-right: 1em;
}
</style>

<script>
import UserCard from "@/components/UserCard.vue";
import TextSettingsEntry from "@/components/TextSettingsEntry.vue";
import ToggleSettingsEntry from "@/components/ToggleSettingsEntry.vue";

export default {
  name: "Impostazioni",
  components: { UserCard, TextSettingsEntry, ToggleSettingsEntry },
};
</script>
