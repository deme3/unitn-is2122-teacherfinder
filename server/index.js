const express = require("express");
const path = require("path");
const history = require('connect-history-api-fallback');

// Inizializzo Express
const app = express();
const port = 8080;

// Definisco endpoint API lato server
app.get("/api", (req, res) => {
    res.send({ works: true });
});

// Endpoint Utente
// ===============
app.get("/api/user/login", (req, res) => {
    
});

app.get("/api/user/logout", (req, res) => {
    
});

app.get("/api/user/checkToken", (req, res) => {
    
});

// Endpoint Annunci
// ================
app.get("/api/ads/list/:userId", (req, res) => {

});

app.get("/api/ads/search/:keyword", (req, res) => {

});

app.get("/api/ads/getAdInfo/:id", (req, res) => {

});

app.post("/api/ads/createAd", (req, res) => {

});

// Endpoint Recensioni
// ===================
app.get("/api/reviews/getReviews/:adId", (req, res) => {
    
});

app.get("/api/reviews/getUserReviews/:userId", (req, res) => {

});

app.post("/api/reviews/postReview", (req, res) => {

});

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

app.put("/api/subscriptions/paySubscription", (req, res) => {
    
});

app.get("/api/subscriptions/list/:userId", (req, res) => {

});

// Endpoint Impostazioni
// =====================
app.get("/api/settings/current", (req, res) => {

});

app.put("/api/settings/change/:settingId/to/:newValue", (req, res) => {

});


// Permetto a Vue.js di gestire le path single-page con Vue Router
app.use(history());
app.use('/', express.static(path.join(__dirname, '..', 'dist')));

// Avvio il server
app.listen(port, () => {
    console.log(`Express server listening: http://localhost:${port}/`)
});