const express = require("express");
const path = require("path");
const history = require("connect-history-api-fallback");

const Database = require("./database/database.js")

// Inizializzo Express
const app = express();
const port = 8080;

// BodyParser per JSON
app.use(express.json());

// Definisco endpoint API lato server
// Funzione che mi permette di verificare che tutti i parametri richiesti siano presenti
const checkParameters =
  (parameters, body) => parameters.every(
    (parameter) => Object.keys(body).includes(parameter)
  );

// Funzione che mi permette di ottenere i parametri mancanti rispetto all'aspettativa dell'endpoint
const getMissingParameters = 
  (expectation, reality) => expectation.filter(x => !Object.keys(reality).includes(x));

app.get("/api", (req, res) => {
  res.send({ works: true });
});

// Endpoint Utente
// ===============
app.put("/api/user/register", (req, res) => {
  // Registro le informazioni su questo utente
  
});

app.get("/api/user/login", (req, res) => {
  // Prendo l'IP dell'utente e lo registro assieme al token

});

app.delete("/api/user/logout/:token", (req, res) => {
  // Rimuovo il token se l'IP del mittente corrisponde

});

app.get("/api/user/checkToken/:token", (req, res) => {
  // Restituisco true se il token e l'IP corrispondono

});

// Endpoint Annunci
// ================
app.get("/api/ads/list/:userId", (req, res) => {});

app.get("/api/ads/search/:keyword", (req, res) => {});

app.get("/api/ads/getAdInfo/:id", (req, res) => {});

app.post("/api/ads/createAd", (req, res) => {});

// Endpoint Recensioni
// ===================
app.get("/api/reviews/getReviews/:adId", (req, res) => {});

app.get("/api/reviews/getUserReviews/:userId", (req, res) => {});

app.post("/api/reviews/postReview", (req, res) => {});

// Endpoint Iscrizioni
// ===================
app.put("/api/subscriptions/acceptSubscription", (req, res) => {
  // tutor
});

app.put("/api/subscriptions/rejectSubscription", (req, res) => {
  // tutor
});

app.put("/api/subscriptions/cancelSubscription", (req, res) => {
  // studente
});

app.put("/api/subscriptions/paySubscription", (req, res) => {});

app.get("/api/subscriptions/list/:userId", (req, res) => {});

// Endpoint Impostazioni
// =====================
app.get("/api/settings/current", (req, res) => {});

app.put("/api/settings/change/:settingId/to/:newValue", (req, res) => {});

// Permetto a Vue.js di gestire le path single-page con Vue Router
// Sul front-end compilato!
app.use(history());
app.use("/", express.static(path.join(__dirname, "..", "dist")));

// Avvio il server
app.listen(port, async () => {
  console.log(`Express server listening: http://localhost:${port}/`);
  console.log(`Caricamento configurazione MongoDB...`);
  await Database.readConfiguration();

  console.log(`Connessione a ${Database.mongoConfig.connectionString}...`);
  await Database.connect();
  console.log("Connesso.");
});
