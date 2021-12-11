<template>
  <div class="annuncio tf-box">
    <div class="container">
      <h1>{{ adInfo.title }}</h1>
      <div class="info">
        <div>
          <p>Prezzo: {{ adInfo.price.toFixed(2) }}€/ora</p>
          <p>Offline</p>
        </div>
        <div>
          <img class="propic" src="https://picsum.photos/100" />
          <p>NicknameProfessore</p>
          <button>Vedi recensioni</button>
        </div>
      </div>
      <p>
        Descrizione dell'annuncio, sono un professore e insegno a tutti i miei
        studenti cose interessanti. Tutti mi stimano perché sono chiaro e
        conciso nelle mie lezioni, e rispondo sempre a tutte le domande ch emi
        vengono poste.
      </p>
      <div class="richieste">
        <button>Chatta con il tutor</button>
        <button>Richiedi erogazione insegnamento</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.adInfo = this.$root.ads.find(x => x.uuid == this.$route.params.uuid);
    this.$watch(
      () => this.$route.params,
      (toParams, previousParams) => {
        console.log(toParams, previousParams);
        // react to route changes...
        // Qua ci va una REST request che chiede i dettagli dell'annuncio
      }
    );
  },
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
  margin-top: 1.34em;
  margin-bottom: 1.34em;
  display: flex;
  flex-direction: row;
  align-items: top;
  justify-content: space-around;
  gap: 1em;
}

.container {
  margin: auto;
}

.propic {
  display: block;
  margin: auto;
}
</style>
