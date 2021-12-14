<template>
  <div class="SignUp tf-box">
    <div class="register-title">Registrati</div>
    <form method="post" @submit.prevent="submitSignUp">
      <div class="register-header">
        <TextSettingsEntry
          v-model:text="form.nickname"
          description="Nickname"
        />
        <TextSettingsEntry v-model:text="form.email" description="E-mail" />
        <TextSettingsEntry
          v-model:text="form.password"
          description="Password"
          password
        />
        <TextSettingsEntry
          v-model:text="form.passwordRepeat"
          description="Ripeti password"
          password
        />
      </div>
      <div class="register-btn-wrapper"><button>Registrati</button></div>
    </form>
  </div>
</template>

<style scoped>
.register-title {
  text-align: center;
}

.register-header {
  border-bottom: 2px solid var(--border-unique-color);
  margin-bottom: 1em;
}
.register-btn-wrapper {
  text-align: right;
}
</style>

<script setup>
import { ref } from "vue";
import TextSettingsEntry from "@/components/TextSettingsEntry.vue";

const form = ref({
  nickname: "",
  email: "",
  password: "",
  passwordRepeat: "",
});

const submitSignUp = () => {
  console.log("Registrazione: ", form.value);
};
</script>
