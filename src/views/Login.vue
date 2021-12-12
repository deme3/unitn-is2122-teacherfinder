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
import TextSettingsEntry from "@/components/TextSettingsEntry.vue";
import ToggleSettingsEntry from "@/components/ToggleSettingsEntry.vue";
const checkCredentials = () => {
  // TO-DO : REST API fetch
  console.log(
    "Credentials: ",
    this.$refs.username.value,
    this.$refs.password.value
  );
  document.cookie = "sessionToken=YES";
};
</script>
