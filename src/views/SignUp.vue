<template>
  <div class="SignUp tf-box">
    <div class="register-title">Registrati</div>
    <form method="post" @submit.prevent="undefined">
      <div class="register-header">
        <TextSettingsEntry ref="email" description="E-mail" />
        <TextSettingsEntry ref="password" description="Password" password />
        <TextSettingsEntry
          ref="password-repeat"
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
import TextSettingsEntry from "@/components/TextSettingsEntry.vue";
</script>
