<template>
  <div class="annuncio">
    <div class="tf-box">
      <div class="container">
        <div class="info">
          <h1>{{ adInfo.title }}</h1>
          <div class="ad-info">
            <p>Prezzo: {{ adInfo.price.toFixed(2) }}€/ora</p>
            <p>Offline</p>
          </div>
          <div class="ad-desc">
            Descrizione dell'annuncio, sono un professore e insegno a tutti i
            miei studenti cose interessanti. Tutti mi stimano perché sono chiaro
            e conciso nelle mie lezioni, e rispondo sempre a tutte le domande ch
            emi vengono poste.
          </div>
        </div>
        <div class="divider"></div>
        <div class="tutor-info">
          <img class="propic" src="https://picsum.photos/100" />
          <div class="tutor-nickname">NicknameProfessore</div>
        </div>
        <div class="richieste">
          <button>Chatta con il tutor</button>
          <button>Richiedi erogazione insegnamento</button>
        </div>
      </div>
    </div>
    <ReviewSection />
  </div>
</template>

<script setup>
import ReviewSection from "@/components/ReviewSection.vue";
import { onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

let adInfo = {
  title: "Caricamento...",
  price: 0,
  grading: 5,
  uuid: "000",
};

onMounted(async () => {
  let uuid = route.params.uuid;
  console.log("Questo è l'uuid dell'annuncio: ", uuid);
  // Qua andrà una richiesta alla REST api
});
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
