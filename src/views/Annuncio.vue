<template>
  <div class="annuncio">
    <div class="tf-box">
      <div class="container">
        <div class="info">
          <h1>{{ adInfo.title }}</h1>
          <RatingStars :rating="adInfo.rating" />
          <div class="ad-info">
            <p>Prezzo: {{ adInfo.price.toFixed(2) }}€/ora</p>
            <p>{{ prettyType }}</p>
          </div>
          <div class="ad-desc">
            {{ adInfo.description }}
          </div>
        </div>
        <div class="divider"></div>
        <div class="tutor-info" @click.prevent="onTutorInfoClick">
          <img class="propic" src="https://picsum.photos/100" />
          <div class="tutor-nickname">{{ adInfo.author.nickname }}</div>
        </div>
        <div class="richieste">
          <button>Chatta con il tutor</button>
          <button>Richiedi erogazione insegnamento</button>
        </div>
      </div>
    </div>
    <ReviewSection :reviews="adInfo.reviews" />
  </div>
</template>

<script setup>
import ReviewSection from "@/components/ReviewSection.vue";
import RatingStars from "@/components/RatingStars.vue";
import { onMounted, reactive, computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

let adInfo = reactive({
  title: "Caricamento...",
  description: "Caricamento...",
  price: 0,
  rating: 5,
  type: "online",
  id: route.params.id,
  author: {
    _id: "",
    firstName: "Caricamento...",
    lastName: "Caricamento...",
    nickname: "Caricamento...",
    email: "Caricamento...",
  },
  reviews: [],
});

let prettyType = computed(() => adInfo.type[0].toUpperCase() + adInfo.type.substr(1));

onMounted(async () => {
  let id = route.params.id;
  console.log("Questo è l'id dell'annuncio: ", id);

  let ad = await fetch(`/api/ads/getAdInfo/${id}`);
  if(ad.status === 200) {
    Object.assign(adInfo, await ad.json());
    document.title = `TeacherFinder – ${adInfo.title}`;
  } else {
    adInfo.title = adInfo.description = "Annuncio non trovato.";
    document.title = "TeacherFinder – Annuncio non trovato";
  }
});

const onTutorInfoClick = () => {
  // Ci andrà il router al tutor profile
  router.push({ name: 'Profilo', params: { userId: adInfo.author._id } });
};
</script>

<style scoped>
.richieste {
  margin-top: 1.34em;
  margin-bottom: 1.34em;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
}

.info {
  margin-bottom: 1.34em;
}

.divider {
  border-bottom: 1px solid var(--border-unique-color);
}

.tutor-info {
  margin: 1.34em 0;
  cursor: pointer;
}

.propic {
  border-radius: 100%;
  display: inline-block;
  vertical-align: middle;
  margin-right: 1rem;
  height: 50px;
  width: 50px;
}

.tutor-nickname {
  display: inline-block;
  margin: auto;
  vertical-align: middle;
}

@media only screen and (max-width: 640px) {
}
</style>
