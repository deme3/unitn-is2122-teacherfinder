<template>
  <div class="tf-box">
    <BackButton class="not-inline" />
    <UserCard
      :firstName="userProfile.firstName"
      :lastName="userProfile.lastName"
      :nickname="userProfile.nickname"
      pictureURL="https://picsum.photos/100"
    />
    <div
      class="profile-parameter"
      v-if="userProfile.biography !== NOTFOUND && userProfile.biography != ''"
    >
      <div class="parameter-descriptor">Biografia</div>
      <div class="parameter-content">{{ userProfile.biography }}</div>
    </div>
    <ReviewSection :reviews="userProfile.reviews" title="Recensioni migliori" />
    <div class="profile-ads-list">
      <h1>Annunci</h1>
      <SearchResult
        v-for="ad in userProfile.ads"
        :key="ad._id"
        :id="ad._id"
        :title="ad.title"
        :price="ad.price"
        :rating="ad.rating"
      />
    </div>
  </div>
</template>

<style scoped>
.not-inline {
  display: block;
  margin: 1em;
}

.profile-parameter {
  margin: 2em 1em;
}

.profile-parameter > div {
  font-style: italic;
}

.profile-parameter .parameter-descriptor {
  font-weight: bold;
  font-size: 11pt;
  margin: 0;
}
</style>

<script setup>
import UserCard from "@/components/UserCard.vue";
import SearchResult from "@/components/SearchResult.vue";
import ReviewSection from "@/components/ReviewSection.vue";
import BackButton from "@/components/BackButton.vue";
import { onMounted, reactive } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const NOTFOUND = "Utente non trovato.";

let userId = "";
let userProfile = reactive({
  firstName: "Caricamento...",
  lastName: "",
  nickname: "???",
  email: "",
  profilePicture: "",
  biography: "Caricamento...",
  ads: [],
  reviews: [],
});

onMounted(async () => {
  userId = route.params.userId;
  console.log("Questo è l'id dell'utente: ", userId);

  let profile = await fetch(`/api/user/profile/${userId}`);
  if (profile.status === 200) {
    Object.assign(userProfile, await profile.json());
    document.title = `TeacherFinder – Profilo di ${userProfile.nickname}`;
  } else {
    userProfile.firstName = userProfile.biography = NOTFOUND;
    document.title = `TeacherFinder – ${NOTFOUND}`;
  }
});
</script>
