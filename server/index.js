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
      description: "API servite via ExpressJS per l'app TeacherFinder",
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

const checkParametersLength = (parameters) =>
  Object.values(parameters).every((parameter) => parameter.length > 0);

// Funzione che mi permette di ottenere i parametri mancanti rispetto all'aspettativa dell'endpoint
const getMissingParameters = (expectation, reality) =>
  expectation.filter((x) => !Object.keys(reality).includes(x));

const getEmptyParameters = (parameters) =>
  Object.keys(parameters).filter((parameter) => parameters[parameter].trim().length == 0);

app.get("/api", (req, res) => {
  res.send({ works: true });
});

// Endpoint Utente
// ===============

// Trasmissione naive di credenziali senza sicurezza a scopo dimostrativo

/**
 * @swagger
 * tags:
 *   - name: user
 *     description: API utente
 *   - name: ads
 *     description: API annunci
 *   - name: reviews
 *     description: API recensioni
 *   - name: subscriptions
 *     description: API iscrizioni
 *   - name: settings
 *     description: API impostazioni
 */

/**
 * @swagger
 * /api/user/register:
 *   put:
 *     summary: Registra un nuovo utente.
 *     tags:
 *       - user
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
 *                  example: 123456789
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
 *                 firstName:
 *                    type: string
 *                    description: Il nome dell'utente.
 *                    example: Mario
 *                 lastName:
 *                    type: string
 *                    description: Il cognome dell'utente.
 *                    example: Rossi
 *                 nickname:
 *                    type: string
 *                    description: Il nickname dell'utente.
 *                    example: Red
 *                 email:
 *                    type: string
 *                    description: L'email dell'account associato all'utente.
 *                    example: mariorossi@a.it
 *                 biography:
 *                    type: string
 *                    description: Breve descrizione dell'utente.
 *                    example: Sono uno studente laureando in matematica di 38 anni, sono scrupoloso, educato e saluto sempre.
 *       500:
 *         description: Utente già esistente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Codice errore identificato
 *                   example: DUPLICATE_ENTRY
 *                 values:
 *                   type: array
 *                   description: Nomi delle colonne duplicate
 *                   example: []
 *       400:
 *         description: Parametri richiesti mancanti
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 missingParameters:
 *                   type: array
 *                   description: Parametri mancanti
 *                   example: ["email", "biography"]
 *                 emptyParameters:
 *                   type: array
 *                   description: Parametri vuoti
 *                   example: ["firstName", "lastName"]
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
    if(!checkParametersLength(req.body)) {
      // Se è la biografia ad essere vuota la ignoro
      let emptyParameters = getEmptyParameters(req.body);
      if(!(emptyParameters.length == 1 && emptyParameters[0] == "biography")) {
        res.status(400).json({
          emptyParameters
        });
        return;
      }
    }

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
 *     summary: Prende l'IP dell'utente e lo registra assieme al token, se il login ha avuto successo.
 *     tags:
 *       - user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nickname:
 *                 type: string
 *                 description: Il nickname dell'utente.
 *                 example: Red
 *               password:
 *                 type: string
 *                 description: La password dell'account associato all'utente.
 *                 example: 123456789
 *               persistent:
 *                 type: boolean
 *                 description: true per far durare la sessione 12 mesi
 *                 example: true
 *     responses:
 *       200:
 *         description: Il login ha avuto successo e la sessione è stata registrata.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID della sessione, anche utilizzato come "session token" (esadecimale)
 *                   example: aaaaaaaaaaaaaaaaaaaaaaaa
 *                 userId:
 *                   type: string
 *                   description: ID Utente associato alla sessione (esadecimale)
 *                   example: bbbbbbbbbbbbbbbbbbbbbbbb
 *                 ipAddress:
 *                   type: string
 *                   description: Indirizzo IPv6 di provenienza, utilizzato per verificare la sessione!
 *                   example: ::1
 *                 persistent:
 *                   type: boolean
 *                   description: true se la sessione durerà 12 mesi
 *                   example: true
 *                 createdAt:
 *                   type: string
 *                   description: Timestamp di creazione della sessione
 *                   example: 2021-12-21T00:00:00.000Z
 *       500:
 *         description: Errore Mongoose
 *       401:
 *         description: Credenziali incorrette
 *       400:
 *         description: Parametri richiesti mancanti
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 missingParameters:
 *                   type: array
 *                   description: Parametri mancanti
 *                   example: ["persistent"]
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
 *     tags:
 *       - user
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *             type: string
 *             example: aaaaaaaaaaaaaaaaaaaaaaaa
 *         required: true
 *         description: ID sessione da rimuovere (esadecimale)
 *     responses:
 *       200:
 *         description: Il token è stato rimosso e il logout è stato completato.
 *       400:
 *         description: Il token non è stato specificato o è invalido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 missingParameters:
 *                   type: array
 *                   description: Parametri mancanti
 *                   example: ["token"]
 *       500:
 *         description: Errore Mongoose
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
 * /api/user/checkToken/{token}:
 *   get:
 *     summary: Verifica la validità del token di sessione.
 *     description: Restituisce true se il token e l'IP corrispondono.
 *     tags:
 *       - user
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *             type: string
 *             example: aaaaaaaaaaaaaaaaaaaaaaaa
 *         required: true
 *         description: ID sessione da controllare (esadecimale)
 *     responses:
 *       200:
 *         description: Token e IP corrispondono.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 exists:
 *                   type: boolean
 *                   description: La sessione esiste se true
 *                   example: true
 *                 error:
 *                   type: boolean
 *                   description: Si è verificato un errore se true
 *                   example: false
 *                 session:
 *                   type: object
 *                   description: Si è verificato un errore se true
 *                   example: { _id: "aaaaaaaaaaaaaaaaaaaaaaaa", userId: "bbbbbbbbbbbbbbbbbbbbbbbb", createdAt: "2021-12-20T19:00:00.000Z" }
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: ID sessione (esadecimale)
 *                     userId:
 *                       type: string
 *                       description: ID utente associato alla sessione (esadecimale)
 *                     createdAt:
 *                       type: string
 *                       description: Data di creazione della sessione
 *                 profile:
 *                   type: object
 *                   description: Profilo dell'utente associato a questa sessione
 *                   example: { firstName: "Mario", lastName: "Rossi", nickname: "Red", email: "mariorossi@a.it", biography: "Sono uno studente laureando in matematica di 38 anni, sono scrupoloso, educato e saluto sempre.", notifications: "010110" }
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: ID utente (esadecimale)
 *                     firstName:
 *                       type: string
 *                       description: Nome utente
 *                     lastName:
 *                       type: string
 *                       description: Cognome utente
 *                     nickname:
 *                       type: string
 *                       description: Nickname utente
 *                     email:
 *                       type: string
 *                       description: E-mail utente
 *                     biography:
 *                       type: string
 *                       description: Biografia utente
 *                     notifications:
 *                       type: string
 *                       description: Codifica delle impostazioni delle notifiche dell'utente
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

/**
 * @swagger
 * /api/user/profile/{id}:
 *   get:
 *     summary: Profilo di un utente
 *     description: Restituisce l'intero profilo di un utente, tra cui anche le tre migliori recensioni e tutti gli annunci che ha pubblicato.
 *     tags:
 *       - user
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *             type: string
 *             example: aaaaaaaaaaaaaaaaaaaaaaaa
 *         required: true
 *         description: ID utente di cui visualizzare il profilo (esadecimale)
 *     responses:
 *       200:
 *         description: L'utente è stato trovato, viene restituito il profilo completo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID utente (esadecimale)
 *                   example: aaaaaaaaaaaaaaaaaaaaaaaa
 *                 firstName:
 *                   type: string
 *                   description: Nome utente
 *                   example: Mario
 *                 lastName:
 *                   type: string
 *                   description: Cognome utente
 *                   example: Rossi
 *                 nickname:
 *                   type: string
 *                   description: Nickname utente
 *                   example: Red
 *                 biography:
 *                   type: string
 *                   description: Biografia utente
 *                   example: Sono uno studente laureando in matematica di 38 anni, sono scrupoloso, educato e saluto sempre.
 *                 email:
 *                   type: string
 *                   description: E-mail utente
 *                   example: mariorossi@a.it
 *                 notifications:
 *                   type: string
 *                   description: Impostazioni notifiche utente
 *                   example: "010110"
 *                 ads:
 *                   type: array
 *                   description: Annunci pubblicati dall'utente
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: ID annuncio (esadecimale)
 *                         example: cccccccccccccccccccccccc
 *                       authorId:
 *                         type: string
 *                         description: ID proprietario annuncio (esadecimale)
 *                         example: aaaaaaaaaaaaaaaaaaaaaaaa
 *                       title:
 *                         type: string
 *                         description: Titolo annuncio
 *                         example: Analisi 3
 *                       description:
 *                         type: string
 *                         description: Descrizione annuncio
 *                         example: Impartisco lezioni di Anlisi 3 su tutto il programma, qualsiasi cosa esso comprenda.
 *                       price:
 *                         type: number
 *                         description: Prezzo all'ora
 *                         example: 5.50
 *                       type:
 *                         type: string
 *                         description: Tipologia annuncio (offline non implementato)
 *                         example: online
 *                       lat:
 *                         type: number
 *                         description: Latitudine posizione (-1 se type = online)
 *                         example: -1
 *                       lon:
 *                         type: number
 *                         description: Longitudine posizione (-1 se type = online)
 *                         example: -1
 *                       rating:
 *                         type: number
 *                         description: Valutazione media arrotondata per eccesso
 *                         example: 3
 *                 reviews:
 *                   type: array
 *                   description: Le tre migliori recensioni date a questo utente
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: ID recensione (esadecimale)
 *                         example: cccccccccccccccccccccccc
 *                       rating:
 *                         type: number
 *                         description: Valutazione
 *                         example: 5
 *                       explanation:
 *                         type: string
 *                         description: Testo recensione
 *                         example: È molto bravo
 *                       author:
 *                         type: object
 *                         description: Informazioni sull'autore della recensione
 *                         properties:
 *                           _id:
 *                             type: string
 *                             description: ID utente
 *                             example: aaaaaaaaaaaaaaaaaaaaaaaa
 *                           firstName:
 *                             type: string
 *                             description: Nome utente
 *                             example: Mario
 *                           lastName:
 *                             type: string
 *                             description: Cognome utente
 *                             example: Rossi
 *                           nickname:
 *                             type: string
 *                             description: Nickname utente
 *                             example: Red
 *                           notifications:
 *                             type: string
 *                             description: Impostazioni notifiche utente
 *                             example: "010110"
 */
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
 *     tags:
 *       - ads
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *             type: string
 *             example: bbbbbbbbbbbbbbbbbbbbbbbb
 *         required: true
 *         description: ID Utente su cui fare a ricerca (esadecimale)
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
 *                         description: ID insegnante autore dell'annuncio (esadecimale)
 *                         example: bbbbbbbbbbbbbbbbbbbbbbbb
 *                       title:
 *                         type: string
 *                         description: Titolo annuncio
 *                         example: Analisi 3
 *                       "description":
 *                         type: string
 *                         description: Descrizione dell'annuncio
 *                         example: Impartisco lezioni di Anlisi 3 su tutto il programma, qualsiasi cosa esso comprenda.
 *                       price:
 *                         type: number
 *                         description: Prezzo all'ora.
 *                         example: 25
 *                       type:
 *                         type: string
 *                         description: Tipologia insegnemento.
 *                         example: online
 *                       lat:
 *                         type: number
 *                         description: Latitudine posizione (se type = offline).
 *                         example: -1
 *                       lon:
 *                         type: number
 *                         description: Longitudine posizione (se type = offline).
 *                         example: -1
 *       400:
 *         description: Parametro mancante.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 missingParameters:
 *                   type: array
 *                   description: Parametro mancante
 *                   example: ["userId"]
 */
app.get("/api/ads/list/:userId", async (req, res) => {
  if (mongoose.isValidObjectId(req.params.userId)) {
    try {
      let foundAds = await Advertisement.getEnrichedAdList(await User.findUserAds(req.params.userId));
      res.status(200).json(foundAds);
    } catch {
      res.sendStatus(500);
    }
  } else {
    res.status(400).json({ missingParameters: ["userId"] });
  }
});

/**
 * @swagger
 * /api/ads/search/{keywords}:
 *   get:
 *     summary: Cerca gli annunci per titolo con le parole chiave specificate
 *     tags:
 *       - ads
 *     parameters:
 *       - in: path
 *         name: keywords
 *         schema:
 *             type: string
 *             example: "analisi I"
 *         required: true
 *         description: Parole chiave con le quali effettuare la ricerca
 *     responses:
 *       200:
 *         description: Risultato della ricerca
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: ID annuncio (esadecimale)
 *                     example: aaaaaaaaaaaaaaaaaaaaaaaa
 *                   authorId:
 *                     type: string
 *                     description: ID insegnante autore dell'annuncio (esadecimale)
 *                     example: bbbbbbbbbbbbbbbbbbbbbbbb
 *                   title:
 *                     type: string
 *                     description: Titolo annuncio
 *                     example: Analisi 3
 *                   "description":
 *                     type: string
 *                     description: Descrizione dell'annuncio
 *                     example: Impartisco lezioni di Anlisi 3 su tutto il programma, qualsiasi cosa esso comprenda.
 *                   price:
 *                     type: number
 *                     description: Prezzo all'ora.
 *                     example: 25
 *                   type:
 *                     type: string
 *                     description: Tipologia insegnemento.
 *                     example: online
 *                   lat:
 *                     type: number
 *                     description: Latitudine posizione (se type = offline).
 *                     example: -1
 *                   lon:
 *                     type: number
 *                     description: Longitudine posizione (se type = offline).
 *                     example: -1
 *                   rating:
 *                     type: number
 *                     description: Valutazione media calcolata su tutte le recensioni dell'annuncio arrotondata per eccesso
 *                     example: 3
 *       500:
 *         description: Errore Mongoose
 */
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
 *     tags:
 *       - ads
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *             type: string
 *             example: cccccccccccccccccccccccc
 *         required: true
 *         description: ID dell'annuncio (esadecimale)
 *     responses:
 *       200:
 *         description: Info annuncio.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID annuncio (esadecimale)
 *                   example: aaaaaaaaaaaaaaaaaaaaaaaa
 *                 authorId:
 *                   type: string
 *                   description: ID insegnante autore dell'annuncio (esadecimale)
 *                   example: bbbbbbbbbbbbbbbbbbbbbbbb
 *                 title:
 *                   type: string
 *                   description: Titolo annuncio
 *                   example: Analisi 3
 *                 description:
 *                   type: string
 *                   description: Descrizione dell'annuncio
 *                   example: Impartisco lezioni di Anlisi 3 su tutto il programma, qualsiasi cosa esso comprenda.
 *                 price:
 *                   type: number
 *                   description: Prezzo all'ora
 *                   example: 25
 *                 type:
 *                   type: string
 *                   description: Tipologia insegnemento
 *                   example: online
 *                 author:
 *                   type: object
 *                   description: Dettagli sull'autore dell'annuncio
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: ID utente (esadecimale)
 *                       example: aaaaaaaaaaaaaaaaaaaaaaaa
 *                     firstName:
 *                       type: string
 *                       description: Nome utente
 *                       example: Mario
 *                     lastName:
 *                       type: string
 *                       description: Cognome utente
 *                       example: Rossi
 *                     nickname:
 *                       type: string
 *                       description: Nickname utente
 *                       example: Red
 *                     biography:
 *                       type: string
 *                       description: Biografia utente
 *                       example: Sono uno studente laureando in matematica di 38 anni, sono scrupoloso, educato e saluto sempre.
 *                     email:
 *                       type: string
 *                       description: Email utente
 *                       example: mariorossi@a.it
 *                     notifications:
 *                       type: string
 *                       description: Impostazioni notifiche dell'utente
 *                       example: "010110"
 *                 rating:
 *                   type: number
 *                   description: Valutazione media calcolata su tutte le recensioni dell'annuncio arrotondata per eccesso
 *                   example: 3
 *                 reviews:
 *                   type: array
 *                   description: Recensioni dell'annuncio
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: ID autore della recensione (esadecimale)
 *                         example: aaaaaaaaaaaaaaaaaaaaaaaa
 *                       rating:
 *                         type: number
 *                         description: Valutazione associata alla recensione (1-5)
 *                         example: 5
 *                       explanation:
 *                         type: string
 *                         description: Testo recensione
 *                         example: È molto bravo
 *                       author:
 *                         type: object
 *                         description: Informazioni sull'autore
 *                         properties:
 *                           _id:
 *                             type: string
 *                             description: ID utente (esadecimale)
 *                             example: aaaaaaaaaaaaaaaaaaaaaaaa
 *                           firstName:
 *                             type: string
 *                             description: Nome utente
 *                             example: Mario
 *                           lastName:
 *                             type: string
 *                             description: Cognome utente
 *                             example: Rossi
 *                           nickname:
 *                             type: string
 *                             description: Nickname utente
 *                             example: Red
 *       404:
 *         description: Annuncio non trovato
 *       400:
 *         description: ID invalido o assente
 *       500:
 *         description: Errore Mongoose
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
        rating = Math.round(reviews.reduce((prev, curr) => { return prev + curr.rating; }, 0) / reviews.length);
      
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
 *     tags:
 *       - ads
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionToken:
 *                  type: string
 *                  description: ID sessione (esadecimale)
 *                  example: aaaaaaaaaaaaaaaaaaaaaaaa
 *               title:
 *                  type: string
 *                  description: Titolo annuncio
 *                  example: Analisi 3
 *               description:
 *                  type: string
 *                  description: Descrizione dell'annuncio
 *                  example: Impartisco lezioni di Anlisi 3 su tutto il programma, qualsiasi cosa esso comprenda.
 *               price:
 *                  type: number
 *                  description: Prezzo all'ora
 *                  example: 25
 *               type:
 *                  type: string
 *                  description: Tipologia insegnemento (offline non implementato)
 *                  example: online
 *               lat:
 *                  type: number
 *                  description: Latitudine posizione (se type = offline, altrimenti -1)
 *                  example: -1
 *               lon:
 *                  type: number
 *                  description: Longitudine posizione (se type = offline, altrimenti -1)
 *                  example: -1
 *     responses:
 *       200:
 *         description: Restituisce l'annuncio appena creato
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: ID nuovo annuncio
 *                   example: aaaaaaaaaaaaaaaaaaaaaaaa
 *                 authorId:
 *                   type: string
 *                   description: ID autore dell'annuncio
 *                   example: bbbbbbbbbbbbbbbbbbbbbbbb
 *                 title:
 *                   type: string
 *                   description: Titolo annuncio
 *                   example: Analisi 3
 *                 description:
 *                   type: string
 *                   description: Descrizione dell'annuncio
 *                   example: Impartisco lezioni di Anlisi 3 su tutto il programma, qualsiasi cosa esso comprenda.
 *                 price:
 *                   type: number
 *                   description: Prezzo all'ora
 *                   example: 25
 *                 type:
 *                   type: string
 *                   description: Tipologia insegnemento (offline non implementato)
 *                   example: online
 *                 lat:
 *                   type: number
 *                   description: Latitudine posizione (se type = offline, altrimenti -1)
 *                   example: -1
 *                 lon:
 *                   type: number
 *                   description: Longitudine posizione (se type = offline, altrimenti -1)
 *                   example: -1
 *       403:
 *         description: Sessione invalida, utente non autorizzato
 *       400:
 *         description: Uno o più parametri assenti.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 missingParameters:
 *                   type: array
 *                   description: Parametri mancanti
 *                   example: ["sessionToken", "price", "lat"]
 *                 emptyParameters:
 *                   type: array
 *                   description: Parametri vuoti
 *                   example: ["sessionToken", "type", "description"]
 *                 invalidParameters:
 *                   type: array
 *                   description: Parametri invalidi (price negativo)
 *                   example: ["price"]
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
      let nonEmpty = {
        title: req.body.title,
        description: req.body.description,
        type: req.body.type,
        sessionToken: req.body.sessionToken,
      };

      // Verifico di non avere parametri vuoti
      if(!checkParametersLength(nonEmpty)) {
        // Se ho dei parametri vuoti annullo
        let emptyParameters = getEmptyParameters(nonEmpty);
        res.status(400).json({ emptyParameters });
        return;
      }

      // Se il price è negativo annullo
      if(req.body.price <= 0.0) {
        res.status(400).json({ invalidParameters: ["price"] });
        return;
      }

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
 *     tags:
 *       - reviews
 *     parameters:
 *       - in: path
 *         name: adId
 *         schema:
 *             type: string
 *             example: cccccccccccccccccccccccc
 *         required: true
 *         description: ID dell'annuncio
 *     responses:
 *       200:
 *         description: Elenco recensioni.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                      type: string
 *                      description: ID recensione
 *                      example: aaaaaaaaaaaaaaaaaaaaaaaa
 *                   authorId:
 *                      type: string
 *                      description: ID autore recensione
 *                      example: bbbbbbbbbbbbbbbbbbbbbbbb
 *                   adId:
 *                      type: string
 *                      description: ID dell'annuncio recensito
 *                      example: cccccccccccccccccccccccc
 *                   rating:
 *                      type: number
 *                      description: Valutazione
 *                      example: 4
 *                   explanation:
 *                      type: string
 *                      description: Testo recensione
 *                      example: Molto bravo e competente, ma una volta non mi ha salutato.
 *       400:
 *         description: ID annuncio invalido o assente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 missingParameters:
 *                   type: array
 *                   description: Parametri mancanti
 *                   example: ["adId"]
 *       500:
 *         description: Errore Mongoose
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
 *     tags:
 *       - reviews
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
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                      type: string
 *                      description: ID recensione
 *                      example: aaaaaaaaaaaaaaaaaaaaaaaa
 *                   authorId:
 *                      type: string
 *                      description: ID autore recensione
 *                      example: bbbbbbbbbbbbbbbbbbbbbbbb
 *                   adId:
 *                      type: string
 *                      description: ID dell'annuncio recensito
 *                      example: cccccccccccccccccccccccc
 *                   rating:
 *                      type: number
 *                      description: Valutazione
 *                      example: 4
 *                   explanation:
 *                      type: string
 *                      description: Testo recensione
 *                      example: Molto bravo e competente, ma una volta non mi ha salutato.
 *       400:
 *         description: ID annuncio invalido o assente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 missingParameters:
 *                   type: array
 *                   description: Parametri mancanti
 *                   example: ["adId"]
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
 *     tags:
 *       - reviews
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionToken:
 *                  type: string
 *                  description: ID sessione utente
 *                  example: aaaaaaaaaaaaaaaaaaaaaaaa
 *               adId:
 *                  type: string
 *                  description: ID annuncio da recensire
 *                  example: cccccccccccccccccccccccc
 *               rating:
 *                  type: number
 *                  description: Valutazione
 *                  example: 4
 *               explanation:
 *                  type: string
 *                  description: Testo recensione
 *                  example: Molto bravo e competente, ma una volta non mi ha salutato.
 *     responses:
 *       200:
 *         description: Restituisce la recensione appena creata
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  _id:
 *                     type: string
 *                     description: ID recensione appena creata
 *                     example: aaaaaaaaaaaaaaaaaaaaaaaa
 *                  authorId:
 *                     type: string
 *                     description: ID autore della recensione
 *                     example: bbbbbbbbbbbbbbbbbbbbbbbb
 *                  adId:
 *                     type: string
 *                     description: ID annuncio recensito
 *                     example: cccccccccccccccccccccccc
 *                  rating:
 *                     type: number
 *                     description: Valutazione
 *                     example: 4
 *                  explanation:
 *                     type: string
 *                     description: Testo recensione
 *                     example: Molto bravo e competente, ma una volta non mi ha salutato.
 *       403:
 *         description: Sessione invalida, utente non autorizzato.
 *       400:
 *         description: Uno o più parametri mancanti.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 missingParameters:
 *                   type: array
 *                   description: Parametri mancanti
 *                   example: ["sessionToken", "rating"]
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
 *     summary: Memorizza una nuova richiesta di iscrizione ad un insegnamento
 *     tags:
 *       - subscriptions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionToken:
 *                 type: string
 *                 description: ID sessione utente
 *                 example: aaaaaaaaaaaaaaaaaaaaaaaa
 *               adId:
 *                 type: string
 *                 description: ID annuncio a cui iscriversi
 *                 example: cccccccccccccccccccccccc
 *               hours:
 *                 type: number
 *                 description: Ore di insegnamento desiderate
 *                 example: 4
 *     responses:
 *       200:
 *         description: Iscrizione.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  subscriberId:
 *                     type: string
 *                     description: ID studente richiedente
 *                     example: dddddddddddddddddddddddd
 *                  adId:
 *                     type: string
 *                     description: ID annuncio
 *                     example: cccccccccccccccccccccccc
 *                  status:
 *                     type: string
 *                     description: Stato attuale dell'iscrizione ("requested" in questa fase)
 *                     example: requested
 *                  hours:
 *                     type: number
 *                     description: Ore di insegnamento desiderate
 *                     example: 4
 *       403:
 *         description: Sessione invalida, utente non autorizzato.
 *       400:
 *         description: Uno o più parametri mancanti
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 missingParameters:
 *                   type: array
 *                   description: Parametri mancanti
 *                   example: ["sessionToken", "hours"]
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
        try {
          let myNewSubscription = await Subscription.create({
            subscriberId,
            adId: req.body.adId,
            status: "requested",
            hours: req.body.hours,
          });
          res.status(200).json(myNewSubscription);
        } catch {
          res.sendStatus(500);
        }
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
 *     summary: L'insegnante accetta una richiesta di insegnamento
 *     tags:
 *       - subscriptions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionToken:
 *                  type: string
 *                  description: ID sessione utente
 *                  example: aaaaaaaaaaaaaaaaaaaaaaaa
 *               subId:
 *                  type: string
 *                  description: ID della richiesta di iscrizione
 *                  example: eeeeeeeeeeeeeeeeeeeeeeee
 *     responses:
 *       200:
 *         description: Iscrizione.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  subscriberId:
 *                     type: string
 *                     description: ID studente richiedente
 *                     example: dddddddddddddddddddddddd
 *                  adId:
 *                     type: string
 *                     description: ID annuncio
 *                     example: cccccccccccccccccccccccc
 *                  status:
 *                     type: string
 *                     description: Stato attuale dell'iscrizione ("waiting_payment" dopo questa call)
 *                     example: waiting_payment
 *                  hours:
 *                     type: number
 *                     description: Ore di insegnamento desiderate
 *                     example: 4
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
 *                   missingParameters:
 *                     type: array
 *                     description: Parametri mancanti
 *                     example: ["sessionToken"]
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
 *     tags:
 *       - subscriptions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionToken:
 *                  type: string
 *                  description: ID sessione utente
 *                  example: aaaaaaaaaaaaaaaaaaaaaaaa
 *               subId:
 *                  type: string
 *                  description: ID della richiesta di iscrizione
 *                  example: eeeeeeeeeeeeeeeeeeeeeeee
 *     responses:
 *       200:
 *         description: Iscrizione.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  subscriberId:
 *                     type: string
 *                     description: ID studente richiedente
 *                     example: dddddddddddddddddddddddd
 *                  adId:
 *                     type: string
 *                     description: ID annuncio
 *                     example: cccccccccccccccccccccccc
 *                  status:
 *                     type: string
 *                     description: Stato attuale dell'iscrizione ("tutor_rejected" dopo questa call)
 *                     example: tutor_rejected
 *                  hours:
 *                     type: number
 *                     description: Ore di insegnamento desiderate
 *                     example: 4
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
 *                   missingParameters:
 *                     type: array
 *                     description: Parametri mancanti
 *                     example: ["sessionToken"]
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
 *     tags:
 *       - subscriptions
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
 *         description: Iscrizione.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  subscriberId:
 *                     type: string
 *                     description: ID studente richiedente
 *                     example: dddddddddddddddddddddddd
 *                  adId:
 *                     type: string
 *                     description: ID annuncio
 *                     example: cccccccccccccccccccccccc
 *                  status:
 *                     type: string
 *                     description: Stato attuale dell'iscrizione ("student_canceled" dopo questa call)
 *                     example: student_canceled
 *                  hours:
 *                     type: number
 *                     description: Ore di insegnamento desiderate
 *                     example: 4
 *       403:
 *         description: L'utente non è proprietario di questa iscrizione.
 *       404:
 *         description: Iscrizione inesistente
 *       400:
 *         description: Parametri incorretti
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   missingParameters:
 *                     type: array
 *                     description: Parametri mancanti
 *                     example: ["sessionToken"]
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
        // Forbidden: Non sono il proprietario dell'iscrizione
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
 *     tags:
 *       - subscriptions
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
 *         description: Iscrizione.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                  subscriberId:
 *                     type: string
 *                     description: ID studente richiedente
 *                     example: dddddddddddddddddddddddd
 *                  adId:
 *                     type: string
 *                     description: ID annuncio
 *                     example: cccccccccccccccccccccccc
 *                  status:
 *                     type: string
 *                     description: Stato attuale dell'iscrizione ("paid" dopo questa call)
 *                     example: paid
 *                  hours:
 *                     type: number
 *                     description: Ore di insegnamento desiderate
 *                     example: 4
 *       403:
 *         description: L'utente non è il proprietario dell'iscrizione
 *       404:
 *         description: Iscrizione inesistente
 *       400:
 *         description: Parametri incorretti
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   missingParameters:
 *                     type: array
 *                     description: Parametri mancanti
 *                     example: ["sessionToken"]
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
/**
 * @swagger
 * /api/settings/change:
 *   put:
 *     summary: Cambia le impostazioni specificate
 *     tags:
 *       - settings
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionToken:
 *                  type: string
 *                  description: ID sessione utente
 *                  example: aaaaaaaaaaaaaaaaaaaaaaaa
 *               updates:
 *                  type: object
 *                  description: Associazione chiave-valore di impostazioni da modificare
 *                  properties:
 *                    nickname:
 *                      type: string
 *                      description: Nuovo nickname
 *                      example: Red2
 *                      required: false
 *                    biography:
 *                      type: string
 *                      description: Nuova biografia
 *                      example: Sono uno studente fuori corso da 5 anni, ma provo a fare del mio meglio per continuare a pagare le tasse
 *                      required: false
 *                    notifications:
 *                      type: string
 *                      description: Nuove impostazioni notifiche (111111 = attiva tutte)
 *                      example: 111111
 *                      required: false
 *     responses:
 *       200:
 *         description: Aggiornamento impostazioni completato
 *       400:
 *         description: Si è verificato un errore con i parametri
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   description: Si è verificato un errore?
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Descrizione testuale dell'errore
 *                   example: "Invalid settings object."
 *       403:
 *         description: Si è verificato un errore con il token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: boolean
 *                   description: Si è verificato un errore?
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Descrizione testuale dell'errore
 *                   example: "Invalid token."
 */
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

      try {
        let updateResult = await User.updateOne({ _id: myToken }, req.body.updates);
        res.status(200).json(updateResult);
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
if(process.env.SHUT_UP) {
  app.listen(port, async () => {
    await Database.readConfiguration();
    await Database.connect();
  });
} else
app.listen(port, async () => {
  if (process?.env?.NODE_ENV !== "development")
    console.log(chalk.black.bgBlue(" INFO ") + " Avvio server di deployment...");
  else if (process?.env?.NODE_ENV == "development")
    console.log(chalk.black.bgBlue(" INFO ") + " Avvio server di development...");
  
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
  if (process?.env?.NODE_ENV !== "development") {
    console.log("  Applicazione accessibile via:");
    console.log("  - Locale:   " + chalk.cyan(`http://localhost:${port}/`));
    console.log("  - Network:  " + chalk.cyan(`http://${lanIp}:${port}/\n`));
  }
  console.log("  Documentazione REST API accessibile via:");
  console.log("  - Locale:   " + chalk.cyan(`http://localhost:${port}/api/docs`));
  console.log("  - Network:  " + chalk.cyan(`http://${lanIp}:${port}/api/docs\n`));
});

module.exports = app;