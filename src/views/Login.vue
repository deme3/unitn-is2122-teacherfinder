<template>
  <div class="tf-box">
    <form method="post" @submit.prevent="checkCredentials">
      <div class="login-header">Login</div>
      <TextEntry ref="username" description="Username o E-mail" />
      <TextEntry ref="password" description="Password" password />
      <ToggleEntry description="Ricordami" />
      <div class="input-wrapper">
        <button type="button" @click.prevent="$router.push({ name: 'SignUp' })">
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
import TextEntry from "@/components/TextEntry.vue";
import ToggleEntry from "@/components/ToggleEntry.vue";

const username = ref(null);
const password = ref(null);

const checkCredentials = () => {
  // TO-DO : REST API fetch
  console.log("Credentials: ", username.value, password.value);
  document.cookie = "sessionToken=YES; SameSite=Strict;";
  window.location.replace("/");
};
</script>
