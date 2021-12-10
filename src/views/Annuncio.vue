<template>
  <div class="annuncio">
    <div class="container">
      <h1>Annuncio {{ $route.params.uuid }}</h1>
      <div class="info">
        <div>
          <p>Prezzo: 10€/ora</p>
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
.annuncio {
  border: 2px solid black;
  box-shadow: 5px 5px 0 #00000020;
  margin: 16px 8px;
  padding: 16px 24px;
  background: white;
}

button {
  border: 2px solid black;
  background: white;
  box-shadow: 2px 2px 0 #00000020;
  padding: 8px 16px;
  transition: box-shadow 0.1s ease-in-out, transform 0.1s ease-in-out;
}

button:hover {
  transform: translate(1px, 1px);
  box-shadow: 1px 1px 0 #00000020;
  cursor: pointer;
}

button:active {
  transform: translate(2px, 2px);
  box-shadow: 0px 0px 0 #00000020;
  cursor: pointer;
}

.richieste {
  margin-top: 0.67em;
  margin-bottom: 0.67em;
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
  width: min(100%, 560px);
  margin: auto;
}

.propic {
  display: block;
  margin: auto;
}
</style>
