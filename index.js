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

// Permetto a Vue.js di gestire le path single-page con Vue Router
app.use(history());
app.use('/', express.static(path.join(__dirname, 'dist')));

// Avvio il server
app.listen(port, () => {
    console.log(`Express server listening on port ${port}`)
});