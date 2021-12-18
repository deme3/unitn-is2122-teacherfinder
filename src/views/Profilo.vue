<template>
  <div class="tf-box">
    <UserCard
      :firstName="userProfile.firstName"
      :lastName="userProfile.lastName"
      :nickname="userProfile.nickname"
      pictureURL="https://picsum.photos/100"
    />
    <div class="profile-parameter" v-if="userProfile.biography !== NOTFOUND">
      <div class="parameter-descriptor">Biografia</div>
      <div class="parameter-content">{{ userProfile.biography }}</div>
    </div>
  </div>
</template>

<style scoped>
.profile-parameter {
  margin: 2em 1em;
}

.profile-parameter .parameter-descriptor {
  font-weight: bold;
  font-size: 11pt;
  margin: 0;
}
</style>

<script setup>
import UserCard from "@/components/UserCard.vue";
import { onMounted, reactive, inject } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const apiBaseURL = inject("apiBaseURL");

const NOTFOUND = "Utente non trovato.";

let userId = "";
let userProfile = reactive({
  firstName: "Caricamento...",
  lastName: "",
  nickname: "???",
  email: "",
  profilePicture: "",
  biography: "Caricamento...",
});

onMounted(async () => {
  userId = route.params.userId;
  console.log("Questo è l'id dell'utente: ", userId);

  let profile = await fetch(`${apiBaseURL}/api/user/profile/${userId}`);
  if (profile.status === 200) {
    Object.assign(userProfile, await profile.json());
    document.title = "Profilo di " + userProfile.nickname;
  } else {
    userProfile.firstName = userProfile.biography = NOTFOUND;
  }
});
</script>