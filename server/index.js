const express = require("express");
const path = require("path");
const history = require("connect-history-api-fallback");

const chalk = require("chalk");
const os = require("os");

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const Database = require("./database/database.js");
const User = require("./database/User.js");
const Session = require("./database/Session.js");
const Advertisement = require("./database/Advertisement.js");
const Review = require("./database/Review.js");
const Subscription = require("./database/Subscription.js");

const MongoError = require("./database/MongoError.js");

// Inizializzo Express
const app = express();
const port = 8080;

//moduli per generare la documentazione delle API
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "TeacherFinder",
      version: "1.0.0",
      description: "This is a API application made with Express.",
      license: {
        name: "MIT License",
        url: "https://raw.githubusercontent.com/deme3/unitn-is2122-teacherfinder/main/LICENSE",
      },
      contact: {
        name: "G14",
        url: "http://www.github.com/deme3/unitn-is2122-teacherfinder/",
      },
    },
    servers: [
      {
        url: "http://localhost:8080/",
        description: "Endpoint API",
      },
    ],
  },
  apis: [path.join(__dirname, "/index.js")],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// BodyParser per JSON
app.use(express.json());

// Definisco endpoint API lato server
// Funzione che mi permette di verificare che tutti i parametri richiesti siano presenti
const checkParameters = (parameters, body) =>
  parameters.every((parameter) => Object.keys(body).includes(parameter));

// Funzione che mi permette di ottenere i parametri mancanti rispetto all'aspettativa dell'endpoint
const getMissingParameters = (expectation, reality) =>
  expectation.filter((x) => !Object.keys(reality).includes(x));

app.get("/api", (req, res) => {
  res.send({ works: true });
});

// Endpoint Utente
// ===============

// Trasmissione naive di credenziali senza sicurezza a scopo dimostrativo

/**
 * @swagger
 * /api/user/register:
 *   put:
 *     summary: Registra un nuovo utente.
 *     description: Registra un nuovo utente memorizzando nel database tutte le informazioni da lui inserite.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                  type: string
 *                  description: Il nome dell'utente.
 *                  example: Mario
 *               lastName:
 *                  type: string
 *                  description: Il cognome dell'utente.
 *                  example: Rossi
 *               nickname:
 *                  type: string
 *                  description: Il nickname dell'utente.
 *                  example: Red
 *               password:
 *                  type: string
 *                  description: La password dell'account associato all'utente.
 *                  example: 0000
 *               email:
 *                  type: string
 *                  description: L'email dell'account associato all'utente.
 *                  example: mariorossi@a.it
 *               biography:
 *                  type: string
 *                  description: Breve descrizione dell'utente.
 *                  example: Sono uno studente laureando in matematica di 38 anni, sono scrupoloso, educato e saluto sempre.
 *     responses:
 *       201:
 *         description: successful executed
 *       500:
 *         description: internal server error
 *       400:
 *         description: un paramentro non è stato trovato
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   MongoError.DUPLICATE_ENTRY.json(err):
 *                     type: json
 *                     description: errore parametro mancante
 *                     example: email
 */
app.put("/api/user/register", async (req, res) => {
  // Registro le informazioni su questo utente
  // Nome, cognome, nickname, password, conferma password, e-mail
  let requiredParameters = [
    "firstName",
    "lastName",
    "nickname",
    "password",
    "email",
    "biography",
  ];

  if (checkParameters(requiredParameters, req.body)) {
    try {
      // Inserisco l'utente nel database
      await User.create(req.body);

      // Rimuovo la password dalla risposta
      delete req.body.password;
      res.status(200).json(req.body);
    } catch (err) {
      if (err.code == MongoError.DUPLICATE_ENTRY.code) {
        // Se l'errore è causato da un valore univoco duplicato invio la causa
        res.status(500).json(MongoError.DUPLICATE_ENTRY.json(err));
      } else {
        // Altrimenti invio solo Internal Server Error
        res.sendStatus(500);
      }
    }
  } else {
    res.status(400).json({
      missingParameters: getMissingParameters(requiredParameters, req.body),
    });
  }
});

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Prende l'IP dell'utente e lo registra assieme al token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nickname:
 *                  type: string
 *                  description: Il nickname dell'utente.
 *                  example: Red
 *               password:
 *                  type: string
 *                  description: La password dell'account associato all'utente.
 *                  example: 0000
 *     responses:
 *       200:
 *         description: session Id.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Session Id.
 *                         example: aaaaaaaaaaaaaaaaaaaaaaaa
 *                       userId:
 *                         type: string
 *                         description: user Id.
 *                         example: bbbbbbbbbbbbbbbbbbbbbbbb
 *                       ipAddress:
 *                         type: string
 *                         description: ip address.
 *                         example: 0.0.0.0
 *       500:
 *         description: utente già registrato
 */
app.post("/api/user/login", async (req, res) => {
  // Prendo l'IP dell'utente e lo registro assieme al token
  let requiredFields = ["nickname", "password"];

  if (checkParameters(requiredFields, req.body)) {
    let myUser = await User.findOne({
      $or: [
        { nickname: req.body.nickname, password: req.body.password }, // match per nickname
        { email: req.body.nickname, password: req.body.password }, // match per e-mail
      ],
    }).exec();

    if (myUser !== null) {
      let mySession = await Session.create({
        userId: myUser._id,
        ipAddress: req.ip,
      });
      res.status(200).json(mySession);
    } else {
      res.status(200).json({ error: "INVALID_CREDENTIALS" });
    }
  } else {
    res.sendStatus(500);
  }
});

/**
 * @swagger
 * /api/user/logout/{token}:
 *   delete:
 *     summary: Effettua il logout.
 *     description: Rimuove il token se l'IP del mittente corrisponde.
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *             type: string
 *             example: aaaaaaaaaaaaaaaaaaaaaaaa
 *         required: true
 *         description: session id
 *     responses:
 *       200:
 *         description: il token è stato rimosso
 *       400:
 *         description: il token non è stato trovato
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   missingParameters:
 *                     type: string
 *                     description: parametro mancante
 *                     example: token
*/
app.delete("/api/user/logout/:token", async (req, res) => {
  // Rimuovo il token se l'IP del mittente corrisponde

  if (typeof req.params.token !== "undefined") {
    let deletedCount = await Session.deleteOne({
      _id: req.params.token,
      ipAddress: req.ip,
    }).exec();
    res.status(200).json({ deletedCount });
  } else {
    res.status(400).json({ missingParameters: ["token"] });
  }
});

/**
 * @swagger
 * /api/user/checkToken/{token}/user/{userId}:
 *   get:
 *     summary: Fa il check del token.
 *     description: Restituisce true se il token e l'IP corrispondono.
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *             type: string
 *             example: aaaaaaaaaaaaaaaaaaaaaaaa
 *         required: true
 *         description: session id
 *       - in: path
 *         name: userId
 *         schema:
 *             type: string
 *             example: bbbbbbbbbbbbbbbbbbbbbbbb
 *         required: true
 *         description: user id
 *     responses:
 *       200:
 *         description: token e IP corrispondono.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: boolean
 */
app.get("/api/user/checkToken/:token/user/:userId", async (req, res) => {
  // Restituisco true se il token e l'IP corrispondono
  if (
    typeof req.params.token !== "undefined" &&
    typeof req.params.userId !== "undefined"
  ) {
    let sessionExists = await Session.checkToken(
      req.params.token,
      req.params.userId,
      req.ip
    );
    res.status(200).json({ sessionExists });
  }
});

// Endpoint Annunci
// ================

/**
 * @swagger
 * /api/ads/list/{userId}:
 *   get:
 *     summary: Trova gli annunci scritti da un utente.
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *             type: string
 *             example: bbbbbbbbbbbbbbbbbbbbbbbb
 *         required: true
 *         description: user id
 *     responses:
 *       200:
 *         description: Questi sono gli annunci scritti dall'utente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       authorId:
 *                         type: string
 *                         description: user Id insegnante.
 *                         example: bbbbbbbbbbbbbbbbbbbbbbbb
 *                       title:
 *                         type: string
 *                         description: titolo.
 *                         example: Analisi 3
 *                       description:
 *                         type: string
 *                         description: Impartisco lezioni di Anlisi 3 su tutto il programma, qualsiasi cosa esso comprenda.
 *                         example: 0.0.0.0
 *                       price:
 *                         type: number
 *                         description: prezzo all'ora.
 *                         example: 25
 *                       type:
 *                         type: string
 *                         description: tipologia insegnemento.
 *                         example: online
 *                       lat:
 *                         type: number
 *                         description: latitudine posizione.
 *                         example: -1
 *                       lon:
 *                         type: number
 *                         description: longitudine posizione.
 *                         example: -1
 *       400:
 *         description: Parametro mancante.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   missingParameters:
 *                     type: string
 *                     description: parametro mancante
 *                     example: id 
 */
app.get("/api/ads/list/:userId", async (req, res) => {
  if (typeof req.params.userId !== "undefined") {
    let foundAds = await User.findUserAds(req.params.userId);
    res.status(200).json(foundAds);
  } else {
    res.status(400).json({ missingParameters: ["userId"] });
  }
});

app.get("/api/ads/search/:keyword", async (req, res) => {});

/**
 * @swagger
 * /api/ads/getAdInfo/{id}:
 *   get:
 *     summary: Restituisce le informazioni di un annuncio.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *             type: string
 *             example: cccccccccccccccccccccccc
 *         required: true
 *         description: id dell'annuncio
 *     responses:
 *       200:
 *         description: Info annuncio.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   authorId:
 *                     type: string
 *                     description: user Id insegnante.
 *                     example: bbbbbbbbbbbbbbbbbbbbbbbb
 *                   title:
 *                     type: string
 *                     description: titolo.
 *                     example: Analisi 3
 *                   description:
 *                     type: string
 *                     description: Impartisco lezioni di Anlisi 3 su tutto il programma, qualsiasi cosa esso comprenda.
 *                     example: 0.0.0.0
 *                   price:
 *                     type: number
 *                     description: prezzo all'ora.
 *                     example: 25
 *                   type:
 *                     type: string
 *                     description: tipologia insegnemento.
 *                     example: online
 *                   lat:
 *                     type: number
 *                     description: latitudine posizione.
 *                     example: -1
 *                   lon:
 *                     type: number
 *                     description: longitudine posizione.
 *                     example: -1
 *       404:
 *         description: Annuncio non trovato
 *       400:
 *         description: Id invalido o assente
 */
app.get("/api/ads/getAdInfo/:id", async (req, res) => {
  if (typeof req.params.id !== "undefined") {
    if (req.params.id.length === 24) {
      let foundAd = await Advertisement.findById(req.params.id);
      if (foundAd !== null) {
        res.status(200).json(foundAd);
      } else {
        res.status(404).json({});
      }
    } else {
      res.sendStatus(400);
    }
  } else {
    res.status(400).json({ missingParameters: ["id"] });
  }
});

/**
 * @swagger
 * /api/ads/createAd:
 *   post:
 *     summary: Crea un nuovo annuncio.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionToken:
 *                  type: string
 *                  description: session id.
 *                  example: aaaaaaaaaaaaaaaaaaaaaaaa
 *               authorId:
 *                  type: string
 *                  description: user Id insegnante.
 *                  example: bbbbbbbbbbbbbbbbbbbbbbbb
 *               title:
 *                  type: string
 *                  description: titolo.
 *                  example: Analisi 3
 *               description:
 *                  type: string
 *                  description: Impartisco lezioni di Anlisi 3 su tutto il programma, qualsiasi cosa esso comprenda.
 *                  example: 0.0.0.0
 *               price:
 *                  type: number
 *                  description: prezzo all'ora.
 *                  example: 25
 *               type:
 *                  type: string
 *                  description: tipologia insegnemento.
 *                  example: online
 *               lat:
 *                  type: number
 *                  description: latitudine posizione.
 *                  example: -1
 *               lon:
 *                  type: number
 *                  description: longitudine posizione.
 *                  example: -1
 *     responses:
 *       200:
 *         description: session Id.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       authorId:
 *                          type: string
 *                          description: user Id insegnante.
 *                          example: bbbbbbbbbbbbbbbbbbbbbbbb
 *                       title:
 *                          type: string
 *                          description: titolo.
 *                          example: Analisi 3
 *                       description:
 *                          type: string
 *                          description: Impartisco lezioni di Anlisi 3 su tutto il programma, qualsiasi cosa esso comprenda.
 *                          example: 0.0.0.0
 *                       price:
 *                          type: number
 *                          description: prezzo all'ora.
 *                          example: 25
 *                       type:
 *                          type: string
 *                          description: tipologia insegnemento.
 *                          example: online
 *                       lat:
 *                          type: number
 *                          description: latitudine posizione.
 *                          example: -1
 *                       lon:
 *                          type: number
 *                          description: longitudine posizione.
 *                          example: -1
 *       403:
 *         description: utente non autorizzato perché non registrato
 *       400:
 *         description: Parametro mancante.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   missingParameters:
 *                     type: string
 *                     description: parametro mancante
 *                     example: sessionToken 
 */
app.post("/api/ads/createAd", async (req, res) => {
  let requiredParameters = [
    "sessionToken",
    "title",
    "description",
    "price",
    "type",
    "lat",
    "lon",
  ];

  if (checkParameters(requiredParameters, req.body)) {
    // Verifico di essere loggato ed ottengo il mio userId
    let currentUserId = await Session.getUserBySession(
      req.body.sessionToken,
      req.ip
    );

    if (currentUserId !== null) {
      // Se sono loggato uso il mio ID per creare un annuncio
      let myNewAd = await Advertisement.create({
        authorId: currentUserId,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        type: req.body.type,
        lat: req.body.lat,
        lon: req.body.lon,
      });
      res.status(200).json(myNewAd);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.status(400).json({
      missingParameters: getMissingParameters(requiredParameters, req.body),
    });
  }
});

// Endpoint Recensioni
// ===================
app.get("/api/reviews/getAdReviews/:adId", async (req, res) => {
  if (typeof req.params.adId !== "undefined") {
    if (req.params.adId.length === 24) {
      let reviews = await Review.find({ adId: req.params.adId }).exec();
      if (reviews !== null) res.status(200).json(reviews);
      else res.status(200).json({});
    } else {
      res.sendStatus(400);
    }
  } else {
    res.status(400).json({ missingParameters: ["adId"] });
  }
});

app.get("/api/reviews/getUserReviews/:userId", async (req, res) => {
  if (typeof req.params.userId !== "undefined") {
    if (req.params.userId.length === 24) {
      // Trovo tutti gli annunci dell'utente
      let userAds = await User.findUserAds(req.params.userId);
      let reviews = [];

      // Per ogni annuncio aggiungo alla lista tutte le recensioni
      for (let ad of userAds) {
        reviews.push(...(await Review.find({ adId: ad._id }).exec()));
      }

      if (reviews !== null) res.status(200).json(reviews);
      else res.status(200).json({});
    } else {
      res.sendStatus(400);
    }
  } else {
    res.status(400).json({ missingParameters: ["userId"] });
  }
});

app.post("/api/reviews/postReview", async (req, res) => {
  let requiredParameters = ["sessionToken", "adId", "rating", "explanation"];

  if (checkParameters(requiredParameters, req.body)) {
    // Verifico di essere un utente loggato e ottengo il mio userId
    let authorId = await Session.getUserBySession(
      req.body.sessionToken,
      req.ip
    );
    if (authorId !== null) {
      // Se sono loggato creo la recensione con il mio ID
      let myNewReview = await Review.create({
        authorId,
        adId: req.body.adId,
        rating: req.body.rating,
        explanation: req.body.explanation,
      });
      res.status(200).json(myNewReview);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.status(400).json({
      missingParameters: getMissingParameters(requiredParameters, req.body),
    });
  }
});

// Endpoint Iscrizioni
// ===================
app.put("/api/subscriptions/requestSubscription", async (req, res) => {
  let requiredParameters = ["sessionToken", "adId", "hours"];

  if (checkParameters(requiredParameters, req.body)) {
    // controllo di ricevere un ID valido (ObjectId con length 24)
    // e controllo di avere un numero come quantità di ore richieste, per non rompere l'integrità del db
    if (req.body.adId.length === 24 && typeof req.body.hours === "number") {
      let subscriberId = await Session.getUserBySession(
        req.body.sessionToken,
        req.ip
      );
      if (subscriberId !== null) {
        let myNewSubscription = await Subscription.create({
          subscriberId,
          adId: req.body.adId,
          status: "requested",
          hours: req.body.hours,
        });
        res.status(200).json(myNewSubscription);
      } else {
        res.sendStatus(403);
      }
    } else {
      res.sendStatus(400);
    }
  } else {
    res.status(400).json({
      missingParameters: getMissingParameters(requiredParameters, req.body),
    });
  }
});

app.put("/api/subscriptions/acceptSubscription", async (req, res) => {
  let requiredParameters = ["sessionToken", "subId"];
  // tutor
  if (
    checkParameters(requiredParameters, req.body) &&
    req.body.subId.length === 24 &&
    req.body.sessionToken.length === 24
  ) {
    let subscription = await Subscription.findById(req.body.subId);
    if (subscription !== null) {
      let updateOp = await subscription.updateStatus(
        req.body.sessionToken,
        req.ip,
        "waiting_payment"
      );

      if (updateOp.success) {
        // Se l'update ha funzionato mando la nuova entry
        res.status(200).json(updateOp.result);
      } else {
        // Forbidden: Non sono il proprietario dell'annuncio
        res.status(403).json(updateOp.result);
      }
    } else {
      // Not Found: Non posso aggiornare un'iscrizione inesistente
      res.sendStatus(404);
    }
  } else {
    // Bad Request: parametri incorretti
    res.status(400).json({
      missingParameters: getMissingParameters(requiredParameters, req.body),
    });
  }
});

app.put("/api/subscriptions/rejectSubscription", async (req, res) => {
  let requiredParameters = ["sessionToken", "subId"];
  // tutor
  if (
    checkParameters(requiredParameters, req.body) &&
    req.body.subId.length === 24 &&
    req.body.sessionToken.length === 24
  ) {
    let subscription = await Subscription.findById(req.body.subId);
    if (subscription !== null) {
      let updateOp = await subscription.updateStatus(
        req.body.sessionToken,
        req.ip,
        "tutor_rejected"
      );

      if (updateOp.success) {
        // Se l'update ha funzionato mando la nuova entry
        res.status(200).json(updateOp.result);
      } else {
        // Forbidden: Non sono il proprietario dell'annuncio
        res.status(403).json(updateOp.result);
      }
    } else {
      // Not Found: Non posso aggiornare un'iscrizione inesistente
      res.sendStatus(404);
    }
  } else {
    // Bad Request: parametri incorretti
    res.status(400).json({
      missingParameters: getMissingParameters(requiredParameters, req.body),
    });
  }
});

app.put("/api/subscriptions/cancelSubscription", async (req, res) => {
  let requiredParameters = ["sessionToken", "subId"];
  // tutor
  if (
    checkParameters(requiredParameters, req.body) &&
    req.body.subId.length === 24 &&
    req.body.sessionToken.length === 24
  ) {
    let subscription = await Subscription.findById(req.body.subId);
    if (subscription !== null) {
      let updateOp = await subscription.updateStatus(
        req.body.sessionToken,
        req.ip,
        "student_canceled"
      );

      if (updateOp.success) {
        // Se l'update ha funzionato mando la nuova entry
        res.status(200).json(updateOp.result);
      } else {
        // Forbidden: Non sono il proprietario dell'annuncio
        res.status(403).json(updateOp.result);
      }
    } else {
      // Not Found: Non posso aggiornare un'iscrizione inesistente
      res.sendStatus(404);
    }
  } else {
    // Bad Request: parametri incorretti
    res.status(400).json({
      missingParameters: getMissingParameters(requiredParameters, req.body),
    });
  }
});

app.put("/api/subscriptions/paySubscription", async (req, res) => {
  // ...
  // elaborazione pagamento
  // ...
  let requiredParameters = ["sessionToken", "subId"];
  // tutor
  if (
    checkParameters(requiredParameters, req.body) &&
    req.body.subId.length === 24 &&
    req.body.sessionToken.length === 24
  ) {
    let subscription = await Subscription.findById(req.body.subId);
    if (subscription !== null) {
      let updateOp = await subscription.updateStatus(
        req.body.sessionToken,
        req.ip,
        "paid"
      );

      if (updateOp.success) {
        // Se l'update ha funzionato mando la nuova entry
        res.status(200).json(updateOp.result);
      } else {
        // Forbidden: Non sono il proprietario dell'annuncio
        res.sendStatus(403);
      }
    } else {
      // Not Found: Non posso aggiornare un'iscrizione inesistente
      res.sendStatus(404);
    }
  } else {
    // Bad Request: parametri incorretti
    res.status(400).json({
      missingParameters: getMissingParameters(requiredParameters, req.body),
    });
  }
});

app.get("/api/subscriptions/list/:userId", async (req, res) => {});

// Endpoint Impostazioni
// =====================
app.get("/api/settings/current", async (req, res) => {});

app.put("/api/settings/change/:settingId/to/:newValue", async (req, res) => {});

// Permetto a Vue.js di gestire le path single-page con Vue Router
// Sul front-end compilato!
app.use(history());
app.use("/", express.static(path.join(__dirname, "..", "dist")));

const lanIp =
  Object.values(os.networkInterfaces())
    .flat()
    .filter((item) => !item.internal && item.family === "IPv4")
    .find(Boolean).address || "( LAN IP )";

// Avvio il server
// prettier-ignore
app.listen(port, async () => {
  console.log(chalk.black.bgBlue(" INFO ") + " Avvio server di deployment...");
  console.log(`Server Express in ascolto su: http://localhost:${port}/`);

  process.stdout.write("Caricamento configurazione MongoDB...");
  await Database.readConfiguration();
  process.stdout.write(chalk.green(" OK\n"));

  process.stdout.write(
    `Connessione a ${Database.mongoConfig.connectionString} ...`
  );
  await Database.connect();
  process.stdout.write(chalk.green(" OK\n"));

  console.log(
    chalk.black.bgGreen("\n FATTO ") + chalk.green(" Avvio completato")
  );
  console.log("\n");
  console.log("  Applicazione accessibile via:");
  console.log("  - Locale:   " + chalk.cyan(`http://localhost:${port}/`));
  console.log("  - Network:  " + chalk.cyan(`http://${lanIp}:${port}/\n`));
  console.log("  Documentazione accessibile via:");
  console.log("  - Locale:   " + chalk.cyan(`http://localhost:${port}/api/docs`));
  console.log("  - Network:  " + chalk.cyan(`http://${lanIp}:${port}/api/docs\n`));
});
