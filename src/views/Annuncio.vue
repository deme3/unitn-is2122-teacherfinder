<template>
  <div class="annuncio tf-box">
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
          Descrizione dell'annuncio, sono un professore e insegno a tutti i miei
          studenti cose interessanti. Tutti mi stimano perché sono chiaro e
          conciso nelle mie lezioni, e rispondo sempre a tutte le domande ch emi
          vengono poste.
        </div>
        <div class="richieste">
          <button>Chatta con il tutor</button>
          <button>Richiedi erogazione insegnamento</button>
        </div>
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
.tutor-nickname {
  margin: 1em auto;
  box-sizing: border-box;
  word-wrap: break-word;
}

.annuncio.tf-box {
  padding: 0;
}

.info, .tutor-info {
  padding: 16px 24px;
}

.container {
  display: flex;
  flex-direction: row;
  gap: 1em;
}

.container .tutor-info {
  width: 30%;
  box-sizing: border-box;
  text-align: center;
  border-right: 1px solid var(--border-unique-shadow);
}

.container .info {
  width: 70%;
  box-sizing: border-box;
}

.container .info h1 {
  margin-bottom: 0;
}

.container .info .ad-info p {
  margin: 0;
}

.container .info .ad-desc {
  text-align: justify;
  word-break: break-word;
  margin: 1.34em auto;
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
  .container {
    flex-direction: column;
  }

  .container .tutor-info {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--border-unique-shadow);
  }

  .container .tutor-info .propic {
    float: left;
  }

  .container .tutor-info button {
    clear: both;
  }

  .container .info {
    width: 100%;
  }

  .container .info h1 {
    margin-top: 0;
  }
}
</style>
