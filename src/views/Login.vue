<template>
  <div class="tf-box">
    <form method="post" @submit.prevent="checkCredentials">
      <div class="login-header">Login</div>
      <TextSettingsEntry ref="username" description="Username o E-mail" />
      <TextSettingsEntry ref="password" description="Password" password />
      <ToggleSettingsEntry description="Ricordami" />
      <div class="input-wrapper">
        <button
          type="button"
          @click.prevent="this.$router.push({ name: 'SignUp' })"
        >
          Registrati
        </button>
        <input type="submit" value="Login" />
      </div>
    </form>
  </div>
</template>

<style scoped>
.login-header {
  text-align: center;
}

.input-wrapper {
  display: flex;
  justify-content: space-between;
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
  window.location.replace("/");
};
</script>
