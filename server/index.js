const express = require("express");
const path = require("path");
const history = require("connect-history-api-fallback");

const chalk = require("chalk");
const os = require("os");

const { check, body, oneOf, validationResult } = require("express-validator");

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

// Opzioni per generare la documentazione delle API.
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "TeacherFinder",
      version: "1.0.0",
      description: "API servita via ExpressJS per l'app TeacherFinder",
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

// BodyParser per JSON.
app.use(express.json());

// Chain di validazione sanitizing per express-validator:
// User
const firstNameChain = () =>
  body("firstName").trim().stripLow().isLength({ min: 1, max: 50 }).escape();

const lastNameChain = () =>
  body("lastName").trim().stripLow().isLength({ min: 1, max: 50 }).escape();

const nicknameChain = (name = "nickname") =>
  body(name)
    .trim()
    .stripLow()
    .toLowerCase()
    .isLength({ min: 3, max: 50 })
    .escape()
    .matches("^[a-z0-9_]+$");

const passwordChain = () => body("password").not().isEmpty();
const emailChain = () => body("email").trim().isEmail().normalizeEmail();
const biographyChain = (name = "biography") =>
  body(name).trim().stripLow().escape();
const persistentChain = () => body("persistent").isBoolean();
const sessionTokenChain = () => body("sessionToken").isMongoId();

const tokenChain = () => check("token").isMongoId();
const idChain = () => check("id").isMongoId();
const userIdChain = () => check("userId").isMongoId();

// Annunci
const titleChain = () =>
  body("title").trim().stripLow().isLength({ min: 1, max: 200 }).escape();

const descriptionChain = () =>
  body("description").trim().stripLow().isLength({ min: 1, max: 1500 }).escape();

const priceChain = () => body("price").isFloat({ min: 1, max: 500 });
const typeChain = () => body("type").exists();
const latChain = () => body("lat").exists();
const lonChain = () => body("lon").exists();
const adIdChain = () => body("adId").isMongoId();

// Review
const ratingChain = () => body("rating").isInt({ min: 1, max: 5 });
const explanationChain = () => body("explanation").trim().stripLow().isLength({ min: 0, max: 500 }).escape();

// Subscription
const hoursChain = () => body("hours").isInt({ min: 1, max: 12 });
const subIdChain = () => body("subId").isMongoId();

// Settings
const notificationsChain = (name = "updates.notifications") =>
  body(name).matches("[10]{6}");

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
 *         description: Parametri richiesti mancanti o invalidi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   description: Errori di validazione degli input
 *                   items:
 *                     type: object
 *                     properties:
 *                       value:
 *                         type: string
 *                         description: Il valore del parametro che ha scatenato l'errore di validazione
 *                         example: ""
 *                       msg:
 *                         type: string
 *                         description: Descrizione dell'errore
 *                         example: "Invalid value"
 *                       param:
 *                         type: string
 *                         description: Il parametro che ha scatenato l'errore di validazione
 *                         example: "firstName"
 *                       location:
 *                         type: string
 *                         description: L'oggetto della richiesta che ha scatenato l'errore di validazione
 *                         example: "body"
 */
app.put(
  "/api/user/register",
  firstNameChain(),
  lastNameChain(),
  nicknameChain(),
  passwordChain(),
  emailChain(),
  biographyChain(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      await User.create(req.body);

      delete req.body.password;
      res.status(200).json(req.body);
    } catch (err) {
      if (err.code == MongoError.DUPLICATE_ENTRY.code)
        res.status(500).json(MongoError.DUPLICATE_ENTRY.json(err));
      else res.sendStatus(500);
    }
  }
);

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
 *         description: Parametri richiesti mancanti o invalidi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   description: Errori di validazione degli input
 *                   items:
 *                     type: object
 *                     properties:
 *                       value:
 *                         type: string
 *                         description: Il valore del parametro che ha scatenato l'errore di validazione
 *                         example: ""
 *                       msg:
 *                         type: string
 *                         description: Descrizione dell'errore
 *                         example: "Invalid value"
 *                       param:
 *                         type: string
 *                         description: Il parametro che ha scatenato l'errore di validazione
 *                         example: "nickname"
 *                       location:
 *                         type: string
 *                         description: L'oggetto della richiesta che ha scatenato l'errore di validazione
 *                         example: "body"
 */
app.post(
  "/api/user/login",
  body("nickname").exists(), // Il login può essere fatto sia per nickname che per email.
  passwordChain(),
  persistentChain(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    // Controllo se esiste l'utente.
    let myUser = await User.findOne({
      $or: [
        { nickname: req.body.nickname, password: req.body.password }, // match per nickname.
        { email: req.body.nickname, password: req.body.password }, // match per e-mail.
      ],
    }).exec();
    if (myUser === null) {
      res.sendStatus(401);
      return;
    }

    // Prendo l'IP dell'utente e lo registro assieme al token.
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
  }
);

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
 *         description: Token mancante o invalido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   description: Errori di validazione degli input
 *                   items:
 *                     type: object
 *                     properties:
 *                       value:
 *                         type: string
 *                         description: Il valore del parametro che ha scatenato l'errore di validazione
 *                         example: "zzzzz"
 *                       msg:
 *                         type: string
 *                         description: Descrizione dell'errore
 *                         example: "Invalid value"
 *                       param:
 *                         type: string
 *                         description: Il parametro che ha scatenato l'errore di validazione
 *                         example: "token"
 *                       location:
 *                         type: string
 *                         description: L'oggetto della richiesta che ha scatenato l'errore di validazione
 *                         example: "params"
 *       500:
 *         description: Errore Mongoose
 */
app.delete(
  "/api/user/logout/:token",
  tokenChain(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    // Rimuovo il token se l'IP del mittente corrisponde.
    try {
      let deletedCount = await Session.deleteOne({
        _id: req.params.token,
        ipAddress: req.ip,
      }).exec();
      res.status(200).json({ deletedCount });
    } catch {
      res.sendStatus(500);
    }
  }
);

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
 *       400:
 *         description: Parametri richiesti mancanti o invalidi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   description: Errori di validazione degli input
 *                   items:
 *                     type: object
 *                     properties:
 *                       value:
 *                         type: string
 *                         description: Il valore del parametro che ha scatenato l'errore di validazione
 *                         example: ""
 *                       msg:
 *                         type: string
 *                         description: Descrizione dell'errore
 *                         example: "Invalid value"
 *                       param:
 *                         type: string
 *                         description: Il parametro che ha scatenato l'errore di validazione
 *                         example: "token"
 *                       location:
 *                         type: string
 *                         description: L'oggetto della richiesta che ha scatenato l'errore di validazione
 *                         example: "params"
 */
app.get(
  "/api/user/checkToken/:token",
  tokenChain(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    // Controllo se la sessione associata all'ip esiste.
    let sessionExists = await Session.checkToken(req.params.token, req.ip);
    if (!sessionExists.exists || sessionExists.expired) {
      res.status(200).json({ ...sessionExists });
      return;
    }

    try {
      let profile = await User.findById(sessionExists.session.userId)
        .select("-password")
        .exec();

      if (profile !== null) res.status(200).json({ ...sessionExists, profile });
      else res.status(200).json({ ...sessionExists, profile: false });
    } catch {
      res.sendStatus(500);
    }
  }
);

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
 *       400:
 *         description: Parametri richiesti mancanti o invalidi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   description: Errori di validazione degli input
 *                   items:
 *                     type: object
 *                     properties:
 *                       value:
 *                         type: string
 *                         description: Il valore del parametro che ha scatenato l'errore di validazione
 *                         example: ""
 *                       msg:
 *                         type: string
 *                         description: Descrizione dell'errore
 *                         example: "Invalid value"
 *                       param:
 *                         type: string
 *                         description: Il parametro che ha scatenato l'errore di validazione
 *                         example: "id"
 *                       location:
 *                         type: string
 *                         description: L'oggetto della richiesta che ha scatenato l'errore di validazione
 *                         example: "params"
 */
app.get(
  "/api/user/profile/:id",
  idChain(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      let user = await User.findById(req.params.id).select("-password").exec();
      let ads = await Advertisement.getEnrichedAdList(
        await Advertisement.find({ authorId: req.params.id }).exec()
      );
      let reviews = await Review.aggregate()
        .match({
          adId: { $in: ads.map((x) => new mongoose.Types.ObjectId(x._id)) },
        })
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
            $arrayElemAt: ["$author", 0],
          },
        })
        .sort({ rating: "desc" })
        .limit(3)
        .exec();

      if (user !== null) res.status(200).json({ ...user._doc, ads, reviews });
      else res.sendStatus(404);
    } catch {
      res.sendStatus(500);
    }
  }
);

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
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
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
 *       400:
 *         description: Parametri richiesti mancanti o invalidi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   description: Errori di validazione degli input
 *                   items:
 *                     type: object
 *                     properties:
 *                       value:
 *                         type: string
 *                         description: Il valore del parametro che ha scatenato l'errore di validazione
 *                         example: ""
 *                       msg:
 *                         type: string
 *                         description: Descrizione dell'errore
 *                         example: "Invalid value"
 *                       param:
 *                         type: string
 *                         description: Il parametro che ha scatenato l'errore di validazione
 *                         example: "userId"
 *                       location:
 *                         type: string
 *                         description: L'oggetto della richiesta che ha scatenato l'errore di validazione
 *                         example: "params"
 */
app.get(
  "/api/ads/list/:userId",
  userIdChain(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      let foundAds = await Advertisement.getEnrichedAdList(
        await User.findUserAds(req.params.userId)
      );
      res.status(200).json(foundAds);
    } catch {
      res.sendStatus(500);
    }
  }
);

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
 *         description: Parametri richiesti mancanti o invalidi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   description: Errori di validazione degli input
 *                   items:
 *                     type: object
 *                     properties:
 *                       value:
 *                         type: string
 *                         description: Il valore del parametro che ha scatenato l'errore di validazione
 *                         example: "zzzz"
 *                       msg:
 *                         type: string
 *                         description: Descrizione dell'errore
 *                         example: "Invalid value"
 *                       param:
 *                         type: string
 *                         description: Il parametro che ha scatenato l'errore di validazione
 *                         example: "id"
 *                       location:
 *                         type: string
 *                         description: L'oggetto della richiesta che ha scatenato l'errore di validazione
 *                         example: "params"
 *       500:
 *         description: Errore Mongoose
 */
app.get(
  "/api/ads/getAdInfo/:id",
  idChain(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      let foundAd = await Advertisement.aggregate()
        .match({ _id: new mongoose.Types.ObjectId(req.params.id) })
        .lookup({
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
          pipeline: [{ $project: { password: 0 } }], // Escludo la password dall'autore.
        })
        .project({
          title: 1,
          description: 1,
          price: 1,
          type: 1,
          author: {
            $arrayElemAt: ["$author", 0],
          },
        })
        .exec();

      if (foundAd === null || foundAd.length === 0) {
        res.status(404).json({});
        return;
      }

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
            $arrayElemAt: ["$author", 0],
          },
        })
        .exec();

      let rating = 0;

      if (reviews !== null && reviews.length > 0)
        rating = Math.round(
          reviews.reduce((prev, curr) => {
            return prev + curr.rating;
          }, 0) / reviews.length
        );

      if (foundAd !== null) {
        res.status(200).json({ ...foundAd[0], rating, reviews });
      } else {
        res.status(404).json({});
      }
    } catch {
      res.sendStatus(500);
    }
  }
);

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
 *         description: Parametri richiesti mancanti o invalidi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   description: Errori di validazione degli input
 *                   items:
 *                     type: object
 *                     properties:
 *                       value:
 *                         type: string
 *                         description: Il valore del parametro che ha scatenato l'errore di validazione
 *                         example: -5
 *                       msg:
 *                         type: string
 *                         description: Descrizione dell'errore
 *                         example: "Invalid value"
 *                       param:
 *                         type: string
 *                         description: Il parametro che ha scatenato l'errore di validazione
 *                         example: "price"
 *                       location:
 *                         type: string
 *                         description: L'oggetto della richiesta che ha scatenato l'errore di validazione
 *                         example: "body"
 */
app.post(
  "/api/ads/createAd",
  sessionTokenChain(),
  titleChain(),
  descriptionChain(),
  priceChain(),
  typeChain(),
  latChain(),
  lonChain(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      // Verifico di essere loggato ed ottengo il mio userId.
      let currentUserId = await Session.getUserBySession(
        req.body.sessionToken,
        req.ip
      );

      if (currentUserId !== null) {
        // Se sono loggato allora uso il mio ID per creare un annuncio.
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
  }
);

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
 *         description: Parametri richiesti mancanti o invalidi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   description: Errori di validazione degli input
 *                   items:
 *                     type: object
 *                     properties:
 *                       value:
 *                         type: string
 *                         description: Il valore del parametro che ha scatenato l'errore di validazione
 *                         example: ""
 *                       msg:
 *                         type: string
 *                         description: Descrizione dell'errore
 *                         example: "Invalid value"
 *                       param:
 *                         type: string
 *                         description: Il parametro che ha scatenato l'errore di validazione
 *                         example: "adId"
 *                       location:
 *                         type: string
 *                         description: L'oggetto della richiesta che ha scatenato l'errore di validazione
 *                         example: "params"
 *       500:
 *         description: Errore Mongoose
 */
app.get(
  "/api/reviews/getAdReviews/:adId",
  adIdChain(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      let reviews = await Review.find({ adId: req.params.adId }).exec();
      if (reviews !== null) res.status(200).json(reviews);
      else res.status(200).json({});
    } catch {
      res.sendStatus(500);
    }
  }
);

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
 *         description: Parametri richiesti mancanti o invalidi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   description: Errori di validazione degli input
 *                   items:
 *                     type: object
 *                     properties:
 *                       value:
 *                         type: string
 *                         description: Il valore del parametro che ha scatenato l'errore di validazione
 *                         example: ""
 *                       msg:
 *                         type: string
 *                         description: Descrizione dell'errore
 *                         example: "Invalid value"
 *                       param:
 *                         type: string
 *                         description: Il parametro che ha scatenato l'errore di validazione
 *                         example: "userId"
 *                       location:
 *                         type: string
 *                         description: L'oggetto della richiesta che ha scatenato l'errore di validazione
 *                         example: "params"
 */
app.get(
  "/api/reviews/getUserReviews/:userId",
  userIdChain(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    // Trovo tutti gli annunci dell'utente.
    let userAds = await User.findUserAds(req.params.userId);
    let reviews = [];

    // Per ogni annuncio aggiungo alla lista tutte le recensioni.
    for (let ad of userAds) {
      reviews.push(...(await Review.find({ adId: ad._id }).exec()));
    }

    if (reviews !== null) res.status(200).json(reviews);
    else res.status(200).json({});
  }
);

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
 *         description: Parametri richiesti mancanti o invalidi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   description: Errori di validazione degli input
 *                   items:
 *                     type: object
 *                     properties:
 *                       value:
 *                         type: string
 *                         description: Il valore del parametro che ha scatenato l'errore di validazione
 *                         example: "zzzz"
 *                       msg:
 *                         type: string
 *                         description: Descrizione dell'errore
 *                         example: "Invalid value"
 *                       param:
 *                         type: string
 *                         description: Il parametro che ha scatenato l'errore di validazione
 *                         example: "sessionToken"
 *                       location:
 *                         type: string
 *                         description: L'oggetto della richiesta che ha scatenato l'errore di validazione
 *                         example: "body"
 */
app.post(
  "/api/reviews/postReview",
  sessionTokenChain(),
  adIdChain(),
  ratingChain(),
  explanationChain(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    // Verifico di essere un utente loggato e ottengo il mio userId.
    let authorId = await Session.getUserBySession(
      req.body.sessionToken,
      req.ip
    );
    if (authorId === null) {
      res.sendStatus(403);
      return;
    }

    // Creo la recensione con il mio ID.
    let myNewReview = await Review.create({
      authorId,
      adId: req.body.adId,
      rating: req.body.rating,
      explanation: req.body.explanation,
    });
    res.status(200).json(myNewReview);
  }
);

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
 *         description: Parametri richiesti mancanti o invalidi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   description: Errori di validazione degli input
 *                   items:
 *                     type: object
 *                     properties:
 *                       value:
 *                         type: string
 *                         description: Il valore del parametro che ha scatenato l'errore di validazione
 *                         example: "zzzz"
 *                       msg:
 *                         type: string
 *                         description: Descrizione dell'errore
 *                         example: "Invalid value"
 *                       param:
 *                         type: string
 *                         description: Il parametro che ha scatenato l'errore di validazione
 *                         example: "sessionToken"
 *                       location:
 *                         type: string
 *                         description: L'oggetto della richiesta che ha scatenato l'errore di validazione
 *                         example: "body"
 */
app.put(
  "/api/subscriptions/requestSubscription",
  sessionTokenChain(),
  adIdChain(),
  hoursChain(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    let subscriberId = await Session.getUserBySession(
      req.body.sessionToken,
      req.ip
    );
    if (subscriberId === null) {
      res.sendStatus(403);
      return;
    }

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
  }
);

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
 *         description: Parametri richiesti mancanti o invalidi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   description: Errori di validazione degli input
 *                   items:
 *                     type: object
 *                     properties:
 *                       value:
 *                         type: string
 *                         description: Il valore del parametro che ha scatenato l'errore di validazione
 *                         example: "zzzz"
 *                       msg:
 *                         type: string
 *                         description: Descrizione dell'errore
 *                         example: "Invalid value"
 *                       param:
 *                         type: string
 *                         description: Il parametro che ha scatenato l'errore di validazione
 *                         example: "sessionToken"
 *                       location:
 *                         type: string
 *                         description: L'oggetto della richiesta che ha scatenato l'errore di validazione
 *                         example: "body"
 */
app.put(
  "/api/subscriptions/acceptSubscription",
  sessionTokenChain(),
  subIdChain(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    // Not Found: Non posso aggiornare un'iscrizione inesistente.
    let subscription = await Subscription.findById(req.body.subId);
    if (subscription === null) {
      res.sendStatus(404);
      return;
    }

    let updateOp = await subscription.updateStatus(
      req.body.sessionToken,
      req.ip,
      "waiting_payment"
    );

    if (updateOp.success) {
      // Se l'update ha funzionato, allora restituisco la nuova entry.
      res.status(200).json(updateOp.result);
    } else {
      // Forbidden: Non sono il proprietario dell'annuncio.
      res.status(403).json(updateOp.result);
    }
  }
);

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
 *         description: Parametri richiesti mancanti o invalidi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   description: Errori di validazione degli input
 *                   items:
 *                     type: object
 *                     properties:
 *                       value:
 *                         type: string
 *                         description: Il valore del parametro che ha scatenato l'errore di validazione
 *                         example: "zzzz"
 *                       msg:
 *                         type: string
 *                         description: Descrizione dell'errore
 *                         example: "Invalid value"
 *                       param:
 *                         type: string
 *                         description: Il parametro che ha scatenato l'errore di validazione
 *                         example: "sessionToken"
 *                       location:
 *                         type: string
 *                         description: L'oggetto della richiesta che ha scatenato l'errore di validazione
 *                         example: "body"
 */
app.put(
  "/api/subscriptions/rejectSubscription",
  sessionTokenChain(),
  subIdChain(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    // Not Found: Non posso aggiornare un'iscrizione inesistente.
    let subscription = await Subscription.findById(req.body.subId);
    if (subscription === null) {
      res.sendStatus(404);
      return;
    }

    let updateOp = await subscription.updateStatus(
      req.body.sessionToken,
      req.ip,
      "tutor_rejected"
    );

    if (updateOp.success) {
      // Se l'update ha funzionato, allora restituisco la nuova entry.
      res.status(200).json(updateOp.result);
    } else {
      // Forbidden: Non sono il proprietario dell'annuncio.
      res.status(403).json(updateOp.result);
    }
  }
);

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
 *         description: Parametri richiesti mancanti o invalidi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   description: Errori di validazione degli input
 *                   items:
 *                     type: object
 *                     properties:
 *                       value:
 *                         type: string
 *                         description: Il valore del parametro che ha scatenato l'errore di validazione
 *                         example: "zzzz"
 *                       msg:
 *                         type: string
 *                         description: Descrizione dell'errore
 *                         example: "Invalid value"
 *                       param:
 *                         type: string
 *                         description: Il parametro che ha scatenato l'errore di validazione
 *                         example: "sessionToken"
 *                       location:
 *                         type: string
 *                         description: L'oggetto della richiesta che ha scatenato l'errore di validazione
 *                         example: "body"
 */
app.put(
  "/api/subscriptions/cancelSubscription",
  sessionTokenChain(),
  subIdChain(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    // Not Found: Non posso aggiornare un'iscrizione inesistente.
    let subscription = await Subscription.findById(req.body.subId);
    if (subscription === null) {
      res.sendStatus(404);
      return;
    }

    let updateOp = await subscription.updateStatus(
      req.body.sessionToken,
      req.ip,
      "student_canceled"
    );

    if (updateOp.success) {
      // Se l'update ha funzionato, allora restituisco la nuova entry.
      res.status(200).json(updateOp.result);
    } else {
      // Forbidden: Non sono il proprietario dell'iscrizione.
      res.status(403).json(updateOp.result);
    }
  }
);

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
 *         description: Parametri richiesti mancanti o invalidi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   description: Errori di validazione degli input
 *                   items:
 *                     type: object
 *                     properties:
 *                       value:
 *                         type: string
 *                         description: Il valore del parametro che ha scatenato l'errore di validazione
 *                         example: "zzzz"
 *                       msg:
 *                         type: string
 *                         description: Descrizione dell'errore
 *                         example: "Invalid value"
 *                       param:
 *                         type: string
 *                         description: Il parametro che ha scatenato l'errore di validazione
 *                         example: "sessionToken"
 *                       location:
 *                         type: string
 *                         description: L'oggetto della richiesta che ha scatenato l'errore di validazione
 *                         example: "body"
 */
app.put(
  "/api/subscriptions/paySubscription",
  sessionTokenChain(),
  subIdChain(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    // Not Found: Non posso aggiornare un'iscrizione inesistente.
    let subscription = await Subscription.findById(req.body.subId);
    if (subscription === null) {
      res.sendStatus(404);
      return;
    }

    let updateOp = await subscription.updateStatus(
      req.body.sessionToken,
      req.ip,
      "paid"
    );

    if (updateOp.success) {
      // Se l'update ha funzionato, allora restituisco la nuova entry.
      res.status(200).json(updateOp.result);
    } else {
      // Forbidden: Non sono il proprietario dell'annuncio.
      res.sendStatus(403);
    }
  }
);

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
 *         description: Parametri richiesti mancanti o invalidi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   description: Errori di validazione degli input
 *                   items:
 *                     type: object
 *                     properties:
 *                       value:
 *                         type: string
 *                         description: Il valore del parametro che ha scatenato l'errore di validazione
 *                         example: "zzzz"
 *                       msg:
 *                         type: string
 *                         description: Descrizione dell'errore
 *                         example: "Invalid value"
 *                       param:
 *                         type: string
 *                         description: Il parametro che ha scatenato l'errore di validazione
 *                         example: "sessionToken"
 *                       location:
 *                         type: string
 *                         description: L'oggetto della richiesta che ha scatenato l'errore di validazione
 *                         example: "body"
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
app.put(
  "/api/settings/change",
  sessionTokenChain(),
  body("updates").exists(),
  oneOf([
    oneOf([
      nicknameChain("updates.nickname"),
      body("updates.nickname").isEmpty(),
    ]),
    oneOf([
      biographyChain("updates.biography"),
      body("updates.biography").isEmpty(),
    ]),
    oneOf([
      notificationsChain("updates.notifications"),
      body("updates.notifications").isEmpty(),
    ]),
  ]),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    let myToken = await Session.getUserBySession(req.body.sessionToken, req.ip);
    if (myToken === null) {
      res.status(403).json({ error: true, message: "Invalid token." });
      return;
    }

    try {
      let updateResult = await User.updateOne(
        { _id: myToken },
        req.body.updates
      );
      res.status(200).json(updateResult);
    } catch (err) {
      if (err.code == MongoError.DUPLICATE_ENTRY.code)
        res.status(500).json(MongoError.DUPLICATE_ENTRY.json(err));
      else res.sendStatus(500);
    }
  }
);

// Permetto a Vue.js di gestire le path single-page con Vue Router, sul front-end compilato!
// Servo il frontend solo se non sono in development mode.
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
