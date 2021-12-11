<template>
  <div class="impostazioni tf-box">
    <h1>Impostazioni</h1>
    <UserCard />
    <TextSettingsEntry description="Nickname" default-value="deme3" />
    <TextSettingsEntry description="Biografia" default-value="Vuoto" multiline />
  </div>
</template>

<script>
import UserCard from '@/components/UserCard.vue';
import TextSettingsEntry from '@/components/TextSettingsEntry.vue';

export default {
    name: "Impostazioni",
    components: { UserCard, TextSettingsEntry }
}
</script>