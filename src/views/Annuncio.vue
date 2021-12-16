<template>
  <div class="annuncio">
    <div class="tf-box">
      <div class="container">
        <div class="tutor-info">
          <img class="propic" src="https://picsum.photos/100" />
          <div class="tutor-nickname">NicknameProfessore</div>
          <button>Vedi recensioni</button>
        </div>
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
          <div class="richieste">
            <button>Chatta con il tutor</button>
            <button>Richiedi erogazione insegnamento</button>
          </div>
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
.tutor-nickname {
  margin: 1em auto;
  box-sizing: border-box;
  word-wrap: break-word;
}

.container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  align-content: stretch;
  align-items: center;
  gap: 2rem;
}

.info {
  flex: 1 1 60%;
}

.tutor-info {
  flex: 0 1;
  text-align: center;
}

.container .info .ad-info p {
  margin: 0;
}

.container .info .ad-desc {
  text-align: justify;
  word-break: break-word;
  margin: 1.34em 0;
}

.richieste {
  margin-top: 1.34em;
  margin-bottom: 1.34em;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
}

@media only screen and (max-width: 640px) {
}
</style>
