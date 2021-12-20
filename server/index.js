const express = require("express");
const path = require("path");
const history = require("connect-history-api-fallback");

const chalk = require("chalk");
const os = require("os");

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const mongoose = require("mongoose");
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
 *                  description: La password dell'account associato dell'utente.
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
 *       200:
 *         description: Utente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   properties:
 *                     firstName:
 *                        type: string
 *                        description: Il nome dell'utente.
 *                        example: Mario
 *                     lastName:
 *                        type: string
 *                        description: Il cognome dell'utente.
 *                        example: Rossi
 *                     nickname:
 *                        type: string
 *                        description: Il nickname dell'utente.
 *                        example: Red
 *                     email:
 *                        type: string
 *                        description: L'email dell'account associato all'utente.
 *                        example: mariorossi@a.it
 *                     biography:
 *                        type: string
 *                        description: Breve descrizione dell'utente.
 *                        example: Sono uno studente laureando in matematica di 38 anni, sono scrupoloso, educato e saluto sempre.
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
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: Session Id.
 *                       example: aaaaaaaaaaaaaaaaaaaaaaaa
 *                     userId:
 *                       type: string
 *                       description: user Id.
 *                       example: bbbbbbbbbbbbbbbbbbbbbbbb
 *                     ipAddress:
 *                       type: string
 *                       description: ip address.
 *                       example: 0.0.0.0
 *       500:
 *         description: utente già registrato
 */
app.post("/api/user/login", async (req, res) => {
  // Prendo l'IP dell'utente e lo registro assieme al token
  let requiredFields = ["nickname", "password", "persistent"];

  if (checkParameters(requiredFields, req.body)) {
    let myUser = await User.findOne({
      $or: [
        { nickname: req.body.nickname, password: req.body.password }, // match per nickname
        { email: req.body.nickname, password: req.body.password }, // match per e-mail
      ],
    }).exec();

    if (myUser !== null) {
      try {
        let mySession = await Session.create({
          userId: myUser._id,
          ipAddress: req.ip,
          persistent: req.body.persistent,
        });
        res.status(200).json(mySession);
      } catch {
        res.sendStatus(500);
      }
    } else {
      res.sendStatus(401);
    }
  } else {
    res.status(400).json({
      missingParameters: getMissingParameters(requiredFields, req.body)
    });
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

  if (mongoose.isValidObjectId(req.params.token)) {
    try {
      let deletedCount = await Session.deleteOne({
        _id: req.params.token,
        ipAddress: req.ip,
      }).exec();
      res.status(200).json({ deletedCount });
    } catch {
      res.sendStatus(500);
    }
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
app.get("/api/user/checkToken/:token", async (req, res) => {
  // Restituisco true se il token e l'IP corrispondono
  // Session.checkToken fa type checking degli ID al suo interno!
  let sessionExists = await Session.checkToken(req.params.token, req.ip);

  if (sessionExists.exists && !sessionExists.expired) {
    try {
      let profile = await User.findById(sessionExists.session.userId).select("-password").exec();

      if (profile !== null) {
        res.status(200).json({ ...sessionExists, profile });
      } else {
        res.status(200).json({ ...sessionExists, profile: false });
      }
    } catch {
      res.sendStatus(500);
    }
  } else {
    res.status(200).json({ ...sessionExists });
  }
});

app.get("/api/user/profile/:id", async (req, res) => {
  if(mongoose.isValidObjectId(req.params.id)) {
    try {
      let user = await User.findById(req.params.id).select("-password").exec();
      let ads = await Advertisement.getEnrichedAdList(
        await Advertisement.find({ authorId: req.params.id }).exec()
      );
      let reviews = await Review.aggregate()
        .match({ adId: { $in: ads.map(x => new mongoose.Types.ObjectId(x._id)) } })
        .lookup({
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
          pipeline: [{ $project: { password: 0, biography: 0, email: 0 } }],
        })
        .project({
          explanation: 1,
          rating: 1,
          author: {
            $arrayElemAt: [ "$author", 0 ]
          },
        })
        .sort({ rating: "desc" })
        .limit(3)
        .exec();

      if(user !== null) res.status(200).json({ ...user._doc, ads, reviews });
      else res.sendStatus(404);
    } catch {
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(400);
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
  if (mongoose.isValidObjectId(req.params.userId)) {
    let foundAds = await User.findUserAds(req.params.userId);
    res.status(200).json(foundAds);
  } else {
    res.status(400).json({ missingParameters: ["userId"] });
  }
});

app.get("/api/ads/search/:keywords", async (req, res) => {
  try {
    let keywords = new RegExp(req.params.keywords?.split(" ").join("|"), "i");
    let foundAds = await Advertisement.find({
      title: { $regex: keywords },
    }).exec();
    let enrichedList = await Advertisement.getEnrichedAdList(foundAds);

    res.status(200).json(enrichedList);
  } catch {
    res.sendStatus(500);
  }
});

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
  if (mongoose.isValidObjectId(req.params.id)) {
    try {
      let foundAd = await Advertisement.aggregate()
        .match({ _id: new mongoose.Types.ObjectId(req.params.id) })
        .lookup({
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
          pipeline: [{ $project: { password: 0 } }], // escludo la password dall'autore
        })
        .project({
          title: 1,
          description: 1,
          price: 1,
          type: 1,
          author: {
            $arrayElemAt: [ "$author", 0 ],
          },
        })
        .exec();

      let reviews = await Review.aggregate()
        .match({ adId: foundAd[0]._id })
        .lookup({
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
          pipeline: [{ $project: { password: 0, biography: 0, email: 0 } }],
        })
        .project({
          explanation: 1,
          rating: 1,
          author: {
            $arrayElemAt: [ "$author", 0 ],
          },
        })
        .exec();
      
      let rating = 0;
      
      if(reviews !== null && reviews.length > 0)
        rating = Math.round(reviews.reduce((prev, curr) => { return prev.rating + curr.rating; }) / reviews.length);
      
      if (foundAd !== null) {
        res.status(200).json({ ...foundAd[0], rating, reviews });
      } else {
        res.status(404).json({});
      }
    } catch {
      res.sendStatus(500);
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
 *         description: annuncio.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                    authorId:
 *                       type: string
 *                       description: user Id insegnante.
 *                       example: bbbbbbbbbbbbbbbbbbbbbbbb
 *                    title:
 *                       type: string
 *                       description: titolo.
 *                       example: Analisi 3
 *                    description:
 *                       type: string
 *                       description: Impartisco lezioni di Anlisi 3 su tutto il programma, qualsiasi cosa esso comprenda.
 *                       example: 0.0.0.0
 *                    price:
 *                       type: number
 *                       description: prezzo all'ora.
 *                       example: 25
 *                    type:
 *                       type: string
 *                       description: tipologia insegnemento.
 *                       example: online
 *                    lat:
 *                       type: number
 *                       description: latitudine posizione.
 *                       example: -1
 *                    lon:
 *                       type: number
 *                       description: longitudine posizione.
 *                       example: -1
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
    try {
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
    } catch {
      res.sendStatus(500);
    }
  } else {
    res.status(400).json({
      missingParameters: getMissingParameters(requiredParameters, req.body),
    });
  }
});

// Endpoint Recensioni
// ===================

/**
 * @swagger
 * /api/reviews/getAdReviews/{adId}:
 *   get:
 *     summary: Fornisce le recensioni dell'annuncio.
 *     parameters:
 *       - in: path
 *         name: adId
 *         schema:
 *             type: string
 *             example: cccccccccccccccccccccccc
 *         required: true
 *         description: id dell'annuncio
 *     responses:
 *       200:
 *         description: Elenco recensioni.
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
 *                          description: Id insegnante.
 *                          example: bbbbbbbbbbbbbbbbbbbbbbbb
 *                       adId:
 *                          type: string
 *                          description: Id dell'annuncio.
 *                          example: cccccccccccccccccccccccc
 *                       rating:
 *                          type: number
 *                          description: Stelline
 *                          example: 4
 *                       explanation:
 *                          type: string
 *                          description: Recensione.
 *                          example: Molto bravo e competente, ma una volta non mi ha salutato.
 *       400:
 *         description: Id invalido o assente
 */
app.get("/api/reviews/getAdReviews/:adId", async (req, res) => {
  if (mongoose.isValidObjectId(req.params.adId)) {
    try {
      let reviews = await Review.find({ adId: req.params.adId }).exec();
      if (reviews !== null) res.status(200).json(reviews);
      else res.status(200).json({});
    } catch {
      res.sendStatus(500);
    }
  } else {
    res.status(400).json({ missingParameters: ["adId"] });
  }
});

/**
 * @swagger
 * /api/reviews/getUserReviews/{userId}:
 *   get:
 *     summary: Fornisce le recensioni dell'insegnante.
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *             type: string
 *             example: bbbbbbbbbbbbbbbbbbbbbbbb
 *         required: true
 *         description: id dell'insegnante
 *     responses:
 *       200:
 *         description: Elenco recensioni.
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
 *                          description: Id insegnante.
 *                          example: bbbbbbbbbbbbbbbbbbbbbbbb
 *                       adId:
 *                          type: string
 *                          description: Id dell'annuncio.
 *                          example: cccccccccccccccccccccccc
 *                       rating:
 *                          type: number
 *                          description: Stelline
 *                          example: 4
 *                       explanation:
 *                          type: string
 *                          description: Recensione.
 *                          example: Molto bravo e competente, ma una volta non mi ha salutato.
 *       400:
 *         description: Id invalido o assente
 */
app.get("/api/reviews/getUserReviews/:userId", async (req, res) => {
  if (mongoose.isValidObjectId(req.params.userId)) {
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
    res.status(400).json({ missingParameters: ["userId"] });
  }
});

/**
 * @swagger
 * /api/reviews/postReview:
 *   post:
 *     summary: Crea una nuova recensione.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionToken:
 *                  type: string
 *                  description: Session id.
 *                  example: aaaaaaaaaaaaaaaaaaaaaaaa
 *               adId:
 *                  type: string
 *                  description: Id annuncio.
 *                  example: cccccccccccccccccccccccc
 *               rating:
 *                  type: number
 *                  description: Stelline.
 *                  example: 4
 *               explanation:
 *                  type: string
 *                  description: Rcensione.
 *                  example: Molto bravo e competente, ma una volta non mi ha salutato.
 *     responses:
 *       200:
 *         description: Recensione.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                    authorId:
 *                       type: string
 *                       description: Id insegnante.
 *                       example: bbbbbbbbbbbbbbbbbbbbbbbb
 *                    adId:
 *                       type: string
 *                       description: Id dell'annuncio.
 *                       example: cccccccccccccccccccccccc
 *                    rating:
 *                       type: number
 *                       description: Stelline
 *                       example: 4
 *                    explanation:
 *                       type: string
 *                       description: Recensione.
 *                       example: Molto bravo e competente, ma una volta non mi ha salutato.
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
app.post("/api/reviews/postReview", async (req, res) => {
  let requiredParameters = ["sessionToken", "adId", "rating", "explanation"];

  if (checkParameters(requiredParameters, req.body)) {
    // Verifico di essere un utente loggato e ottengo il mio userId
    // Session.getUserBySession fa già type checking!
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

/**
 * @swagger
 * /api/subscriptions/requestSubscription:
 *   put:
 *     summary: Memorizza una nuova iscrizione ad un insegnamento.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionToken:
 *                  type: string
 *                  description: Session id.
 *                  example: aaaaaaaaaaaaaaaaaaaaaaaa
 *               adId:
 *                  type: string
 *                  description: Id annuncio.
 *                  example: cccccccccccccccccccccccc
 *               hours:
 *                  type: number
 *                  description: Ore di insegnamento programmate.
 *                  example: 12
 *     responses:
 *       200:
 *         description: Iscrizione.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                    subscriberId:
 *                       type: string
 *                       description: Id studente richiedente.
 *                       example: dddddddddddddddddddddddd
 *                    adId:
 *                       type: string
 *                       description: Id dell'annuncio.
 *                       example: cccccccccccccccccccccccc
 *                    status:
 *                       type: string
 *                       description: stato dell'iscrizione.
 *                       example: requested
 *                    hours:
 *                       type: number
 *                       description: Ore di insegnamento programmate.
 *                       example: 12
 *       403:
 *         description: utente non autorizzato perché non registrato
 *       400:
 *         description: Id invalido o assente
 */
app.put("/api/subscriptions/requestSubscription", async (req, res) => {
  let requiredParameters = ["sessionToken", "adId", "hours"];

  if (checkParameters(requiredParameters, req.body)) {
    // controllo di ricevere un ID valido (ObjectId con length 24)
    // e controllo di avere un numero come quantità di ore richieste, per non rompere l'integrità del db
    if (
      mongoose.isValidObjectId(req.body.adId) &&
      typeof req.body.hours === "number"
    ) {
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

/**
 * @swagger
 * /api/subscriptions/acceptSubscription:
 *   put:
 *     summary: L'insegnante accetta una richiesta di insegnamento.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionToken:
 *                  type: string
 *                  description: Session id.
 *                  example: aaaaaaaaaaaaaaaaaaaaaaaa
 *               subId:
 *                  type: string
 *                  description: Id della richiesta di iscrizione.
 *                  example: eeeeeeeeeeeeeeeeeeeeeeee
 *     responses:
 *       200:
 *         description: Richiesta di insegnamento.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                    sessionToken:
 *                       type: string
 *                       description: Session id insegnante.
 *                       example: aaaaaaaaaaaaaaaaaaaaaaaa
 *                    ipAddress:
 *                       type: string
 *                       description: ip address.
 *                       example: 0.0.0.0
 *                    status:
 *                       type: string
 *                       description: stato dell'iscrizione.
 *                       example: waiting_payment
 *       403:
 *         description: L'utente non è il proprietario dell'annuncio
 *       404:
 *         description: Iscrizione inesistente
 *       400:
 *         description: Parametri incorretti
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
app.put("/api/subscriptions/acceptSubscription", async (req, res) => {
  let requiredParameters = ["sessionToken", "subId"];
  // tutor
  if (
    checkParameters(requiredParameters, req.body) &&
    mongoose.isValidObjectId(req.body.subId) &&
    mongoose.isValidObjectId(req.body.sessionToken)
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

/**
 * @swagger
 * /api/subscriptions/rejectSubscription:
 *   put:
 *     summary: L'insegnante rifiuta una richiesta di insegnamento.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionToken:
 *                  type: string
 *                  description: Session id.
 *                  example: aaaaaaaaaaaaaaaaaaaaaaaa
 *               subId:
 *                  type: string
 *                  description: Id della richiesta di iscrizione.
 *                  example: eeeeeeeeeeeeeeeeeeeeeeee
 *     responses:
 *       200:
 *         description: Richiesta di insegnamento.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                    sessionToken:
 *                       type: string
 *                       description: Session id insegnante.
 *                       example: aaaaaaaaaaaaaaaaaaaaaaaa
 *                    ipAddress:
 *                       type: string
 *                       description: ip address.
 *                       example: 0.0.0.0
 *                    status:
 *                       type: string
 *                       description: stato dell'iscrizione.
 *                       example: tutor_rejected
 *       403:
 *         description: L'utente non è il proprietario dell'annuncio
 *       404:
 *         description: Iscrizione inesistente
 *       400:
 *         description: Parametri incorretti
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
app.put("/api/subscriptions/rejectSubscription", async (req, res) => {
  let requiredParameters = ["sessionToken", "subId"];
  // tutor
  if (
    checkParameters(requiredParameters, req.body) &&
    mongoose.isValidObjectId(req.body.subId) &&
    mongoose.isValidObjectId(req.body.sessionToken)
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

/**
 * @swagger
 * /api/subscriptions/cancelSubscription:
 *   put:
 *     summary: Lo studente annulla una richiesta di insegnamento.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionToken:
 *                  type: string
 *                  description: Session id.
 *                  example: aaaaaaaaaaaaaaaaaaaaaaaa
 *               subId:
 *                  type: string
 *                  description: Id della richiesta di iscrizione.
 *                  example: eeeeeeeeeeeeeeeeeeeeeeee
 *     responses:
 *       200:
 *         description: Richiesta di insegnamento.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                    sessionToken:
 *                       type: string
 *                       description: Session id insegnante.
 *                       example: aaaaaaaaaaaaaaaaaaaaaaaa
 *                    ipAddress:
 *                       type: string
 *                       description: ip address.
 *                       example: 0.0.0.0
 *                    status:
 *                       type: string
 *                       description: stato dell'iscrizione.
 *                       example: student_canceled
 *       403:
 *         description: L'utente non è iscrittto
 *       404:
 *         description: Iscrizione inesistente
 *       400:
 *         description: Parametri incorretti
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
app.put("/api/subscriptions/cancelSubscription", async (req, res) => {
  let requiredParameters = ["sessionToken", "subId"];
  // tutor
  if (
    checkParameters(requiredParameters, req.body) &&
    mongoose.isValidObjectId(req.body.subId) &&
    mongoose.isValidObjectId(req.body.sessionToken)
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

/**
 * @swagger
 * /api/subscriptions/paySubscription:
 *   put:
 *     summary: Lo studente paga un insegnamento.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionToken:
 *                  type: string
 *                  description: Session id.
 *                  example: aaaaaaaaaaaaaaaaaaaaaaaa
 *               subId:
 *                  type: string
 *                  description: Id della richiesta di iscrizione.
 *                  example: eeeeeeeeeeeeeeeeeeeeeeee
 *     responses:
 *       200:
 *         description: Insegnamento.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                    sessionToken:
 *                       type: string
 *                       description: Session id insegnante.
 *                       example: aaaaaaaaaaaaaaaaaaaaaaaa
 *                    ipAddress:
 *                       type: string
 *                       description: ip address.
 *                       example: 0.0.0.0
 *                    status:
 *                       type: string
 *                       description: stato dell'iscrizione.
 *                       example: paid
 *       403:
 *         description: L'utente non è iscritto
 *         description: Iscrizione inesistente
 *       400:
 *         description: Parametri incorretti
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
app.put("/api/subscriptions/paySubscription", async (req, res) => {
  // ...
  // elaborazione pagamento
  // ...
  let requiredParameters = ["sessionToken", "subId"];
  // tutor
  if (
    checkParameters(requiredParameters, req.body) &&
    mongoose.isValidObjectId(req.body.subId) &&
    mongoose.isValidObjectId(req.body.sessionToken)
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
app.put("/api/settings/change", async (req, res) => {
  let requiredParameters = ["sessionToken", "updates"];
  let allowedSettings = ["nickname", "biography", "notifications"];

  if (
    checkParameters(requiredParameters, req.body) &&
    mongoose.isValidObjectId(req.body.sessionToken)
  ) {
    let myToken = await Session.getUserBySession(req.body.sessionToken, req.ip);
    if (myToken === null) {
      res.status(403).json({ error: true, message: "Invalid token." });
      return;
    }

    if (typeof req.body.updates !== "object") {
      res.status(400).json({ error: true, message: "Invalid settings object." });
      return;
    }
    
    let updateKeys = Object.keys(req.body.updates);
    if (updateKeys.length > 0) {
      for (let updateKey of updateKeys) {
        if(!allowedSettings.includes(updateKey)) {
          res.status(400).json({ error: true, message: `Invalid setting: ${updateKey}.` });
          return;
        }
      }

      let updateResult = await User.updateOne({ _id: myToken }, req.body.updates);
      res.status(200).json(updateResult);
    } else {
      res.status(400).json({ error: true, message: "No changes." });
    }
  } else {
    res.status(400).json({
      missingParameters: getMissingParameters(requiredParameters, req.body),
      validToken: mongoose.isValidObjectId(req.body.sessionToken),
    });
  }
});

// Permetto a Vue.js di gestire le path single-page con Vue Router
// Sul front-end compilato!
// Solo in deployment.
if (process?.env?.NODE_ENV !== "development") {
  app.use(history());
  app.use("/", express.static(path.join(__dirname, "..", "dist")));
}

const lanIp =
  Object.values(os.networkInterfaces())
    .flat()
    .filter((item) => !item.internal && item.family === "IPv4")
    .find(Boolean)?.address || "( LAN IP )";

// Avvio il server
app.enable("trust proxy");
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
  console.log("  Documentazione REST API accessibile via:");
  console.log("  - Locale:   " + chalk.cyan(`http://localhost:${port}/api/docs`));
  console.log("  - Network:  " + chalk.cyan(`http://${lanIp}:${port}/api/docs\n`));
});
