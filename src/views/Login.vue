<template>
  <form method="post" class="tf-box" @submit.prevent="checkCredentials">
    <div class="login-header">Login</div>
    <TextSettingsEntry ref="username" description="Username o E-mail" />
    <TextSettingsEntry ref="password" description="Password" password />
    <ToggleSettingsEntry description="Ricordami" />
    <input type="submit" value="Login" />
  </form>
</template>

<style scoped>
.login-header {
  text-align: center;
}
</style>

<script setup>
import { ref } from "vue";
import TextSettingsEntry from "@/components/TextSettingsEntry.vue";
import ToggleSettingsEntry from "@/components/ToggleSettingsEntry.vue";

const username = ref(null);
const password = ref(null);

const checkCredentials = () => {
  // TO-DO : REST API fetch
  console.log("Credentials: ", username.value, password.value);
  document.cookie = "sessionToken=YES";
};
</script>
