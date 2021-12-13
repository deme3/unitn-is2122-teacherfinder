const express = require("express");
const path = require("path");
const history = require("connect-history-api-fallback");

const Database = require("./database/database.js");
const User = require("./database/User.js");
const Session = require("./database/Session.js");
const Advertisement = require("./database/Advertisement.js");
const Review = require("./database/Review.js");

const MongoError = require("./database/MongoError.js");

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

// Trasmissione naive di credenziali senza sicurezza a scopo dimostrativo
app.put("/api/user/register", async (req, res) => {
  // Registro le informazioni su questo utente
  // Nome, cognome, nickname, password, conferma password, e-mail
  let requiredParameters = [
    "firstName",
    "lastName",
    "nickname",
    "password",
    "email",
    "biography"
  ];

  if(checkParameters(requiredParameters, req.body)) {
    try {
      // Inserisco l'utente nel database
      await User.create(req.body);

      // Rimuovo la password dalla risposta
      delete req.body.password;
      res.status(200).json(req.body);
    } catch(err) {
      if(err.code == MongoError.DUPLICATE_ENTRY.code) {
        // Se l'errore è causato da un valore univoco duplicato invio la causa
        res.status(500).json(MongoError.DUPLICATE_ENTRY.json(err));
      } else {
        // Altrimenti invio solo Internal Server Error
        res.sendStatus(500);
      }
    }
  } else {
    res.status(400).json({
      missingParameters: getMissingParameters(requiredParameters, req.body)
    });
  }
});

app.get("/api/user/login", async (req, res) => {
  // Prendo l'IP dell'utente e lo registro assieme al token
  let requiredFields = [ "nickname", "password" ];

  if(checkParameters(requiredFields, req.body)) {
    let myUser = await User
      .findOne({ 
        $or: [
          { nickname: req.body.nickname, password: req.body.password }, // match per nickname
          { email: req.body.nickname, password: req.body.password } // match per e-mail
        ]
      }).exec();
    
    if(myUser !== null) {
      let mySession = await Session.create({ userId: myUser._id, ipAddress: req.ip });
      res.status(200).json(mySession);
    } else {
      res.status(200).json({});
    }
  } else {
    res.sendStatus(500);
  }
});

app.delete("/api/user/logout/:token", async (req, res) => {
  // Rimuovo il token se l'IP del mittente corrisponde

  if(typeof req.params.token !== "undefined") {
    let deletedCount = await Session.deleteOne({ _id: req.params.token, ipAddress: req.ip }).exec();
    res.status(200).json({ deletedCount });
  } else {
    res.status(400).json({ missingParameters: ["token"] });
  }
});

app.get("/api/user/checkToken/:token/user/:userId", async (req, res) => {
  // Restituisco true se il token e l'IP corrispondono
  if(typeof req.params.token !== "undefined" && typeof req.params.userId !== "undefined") {
    let sessionExists = await Session.checkToken(req.params.token, req.params.userId, req.ip);
    res.status(200).json({ sessionExists });
  }
});

// Endpoint Annunci
// ================
app.get("/api/ads/list/:userId", async (req, res) => {
  if(typeof req.params.userId !== "undefined") {
    let foundAds = await User.findUserAds(req.params.userId);
    res.status(200).json(foundAds);
  } else {
    res.status(400).json({ missingParameters: [ "userId" ] });
  }
});

app.get("/api/ads/search/:keyword", async (req, res) => {});

app.get("/api/ads/getAdInfo/:id", async (req, res) => {
  if(typeof req.params.id !== "undefined") {
    if(req.params.id.length === 24) {
      let foundAd = await Advertisement.findById(req.params.id);
      if(foundAd !== null) {
        res.status(200).json(foundAd);
      } else {
        res.status(404).json({});
      }
    } else {
      res.sendStatus(400);
    }
  } else {
    res.status(400).json({ missingParameters: [ "id" ] });
  }
});

app.post("/api/ads/createAd", async (req, res) => {
  let requiredParameters = [
    "sessionToken",
    "title",
    "description",
    "price",
    "type",
    "lat",
    "lon"
  ];

  if(checkParameters(requiredParameters, req.body)) {
    // Verifico di essere loggato ed ottengo il mio userId
    let currentUserId = await Session.getUserBySession(req.body.sessionToken, req.ip);

    if(currentUserId !== null) {
      // Se sono loggato uso il mio ID per creare un annuncio
      let myNewAd = await Advertisement.create({
        authorId: currentUserId,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        type: req.body.type,
        lat: req.body.lat,
        lon: req.body.lon
      });
      res.status(200).json(myNewAd);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.status(400).json({
      missingParameters: getMissingParameters(requiredParameters, req.body)
    })
  }
});

// Endpoint Recensioni
// ===================
app.get("/api/reviews/getAdReviews/:adId", async (req, res) => {
  if(typeof req.params.adId !== "undefined") {
    if(req.params.adId.length === 24) {
      let reviews = await Review.find({ adId: req.params.adId }).exec();
      if(reviews !== null)
        res.status(200).json(reviews);
      else
        res.status(200).json({});
    } else {
      res.sendStatus(400);
    }
  } else {
    res.status(400).json({ missingParameters: [ "adId" ]});
  }
});

app.get("/api/reviews/getUserReviews/:userId", async (req, res) => {
  if(typeof req.params.userId !== "undefined") {
    if(req.params.userId.length === 24) {
      // Trovo tutti gli annunci dell'utente
      let userAds = await User.findUserAds(req.params.userId);
      let reviews = [];
      
      // Per ogni annuncio aggiungo alla lista tutte le recensioni
      for(let ad of userAds) {
        reviews.push(...await Review.find({ adId: ad._id }).exec());
      }
      
      if(reviews !== null)
        res.status(200).json(reviews);
      else
        res.status(200).json({});
    } else {
      res.sendStatus(400);
    }
  } else {
    res.status(400).json({ missingParameters: [ "userId" ]});
  }
});

app.post("/api/reviews/postReview", async (req, res) => {
  let requiredParameters = [
    "sessionToken",
    "adId",
    "rating",
    "explanation"
  ];

  if(checkParameters(requiredParameters, req.body)) {
    // Verifico di essere un utente loggato e ottengo il mio userId
    let authorId = await Session.getUserBySession(req.body.sessionToken, req.ip);
    if(authorId !== null) {
      // Se sono loggato creo la recensione con il mio ID
      let myNewReview = await Review.create({
        authorId,
        adId: req.body.adId,
        rating: req.body.rating,
        explanation: req.body.explanation
      });
      res.status(200).json(myNewReview);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.status(400).json({
      missingParameters: getMissingParameters(requiredParameters, req.body)
    });
  }
});

// Endpoint Iscrizioni
// ===================
app.put("/api/subscriptions/acceptSubscription", async (req, res) => {
  // tutor
});

app.put("/api/subscriptions/rejectSubscription", async (req, res) => {
  // tutor
});

app.put("/api/subscriptions/cancelSubscription", async (req, res) => {
  // studente
});

app.put("/api/subscriptions/paySubscription", async (req, res) => {});

app.get("/api/subscriptions/list/:userId", async (req, res) => {});

// Endpoint Impostazioni
// =====================
app.get("/api/settings/current", async (req, res) => {});

app.put("/api/settings/change/:settingId/to/:newValue", async (req, res) => {});

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
