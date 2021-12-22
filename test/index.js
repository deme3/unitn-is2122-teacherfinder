process.env.SHUT_UP = true;
const test = require("tape");
const request = require("supertest");
const app = require("../server/index.js");

let sessionToken = "";

test('[PUT] /api/user/register: Registro Mario Rossi', function(assert) {
  request(app).put('/api/user/register').send({
    firstName: "Mario",
    lastName: "Rossi",
    nickname: "red",
    password: "rossimario123",
    email: "mariorossi@a.it",
    biography: ""
  })
  .expect(200)
  .expect("Content-Type", /json/)
  .end((err, res) => {
    let expectedResult = {
      firstName: "Mario",
      lastName: "Rossi",
      nickname: "red",
      email: "mariorossi@a.it",
      biography: "",
    };
    assert.error(err, "Nessun errore");
    assert.same(res.body, expectedResult, "Utente registrato");
    assert.end();
  });
});

test('[POST] /api/user/login: Faccio il login via username Red', function(assert) {
  assert.plan(4);
  request(app).post('/api/user/login').send({
    nickname: "red",
    password: "rossimario123",
    persistent: true,
  })
  .expect(200)
  .expect("Content-Type", /json/)
  .end((err, res) => {
    sessionToken = res.body._id ?? "";
    assert.error(err, "Nessun errore");
    assert.ok(res.body._id, "Sessione generata");

    assert.test('[GET] /api/user/profile/' + res.body.userId, function(assert) {
      assert.plan(6);
      request(app)
      .get('/api/user/profile/' + res.body.userId)
      .expect(200)
      .expect("Content-Type", /json/)
      .end((err, res) => {
        assert.error(err, "Nessun errore");
        assert.same(res.body.firstName, "Mario", "Nome utente");
        assert.same(res.body.lastName, "Rossi", "Cognome utente");
        assert.same(res.body.email, "mariorossi@a.it", "E-mail utente");
        assert.notOk(res.body.password, "Password non esposta");
        assert.ok(res.body.ads, "Lista annunci presente");
        assert.end();
      });
    });

    assert.test('[DELETE] /api/user/logout: Logout ' + sessionToken, function(assert) {
      assert.plan(2);
      request(app)
      .delete('/api/user/logout/' + sessionToken)
      .expect(200)
      .expect("Content-Type", /json/)
      .end((err, res) => {
        assert.error(err, "Nessun errore");
        assert.same(res.body.deletedCount.deletedCount, 1, "Sessione rimossa");
        assert.end();
      });
    });
  });
});

test('[POST] /api/user/login: Faccio il login via e-mail mariorossi@a.it', function(assert) {
  assert.plan(3);
  request(app).post('/api/user/login').send({
    nickname: "mariorossi@a.it",
    password: "rossimario123",
    persistent: true,
  })
  .expect(200)
  .expect("Content-Type", /json/)
  .end((err, res) => {
    sessionToken = res.body._id ?? "";
    assert.error(err, "Nessun errore");
    assert.ok(res.body._id, "Sessione generata");

    assert.test('[DELETE] /api/user/logout: Logout ' + sessionToken, function(assert) {
      assert.plan(2);
      request(app)
      .delete('/api/user/logout/' + sessionToken)
      .expect(200)
      .expect("Content-Type", /json/)
      .end((err, res) => {
        assert.error(err, "Nessun errore");
        assert.same(res.body.deletedCount.deletedCount, 1, "Sessione rimossa");
        assert.end();
      });
    });
  });
});

test('[PUT] /api/user/register: Provo a registrare un utente duplicato', function(assert) {
  request(app).put('/api/user/register').send({
    firstName: "Mario",
    lastName: "Rossi",
    nickname: "red",
    password: "rossimario123",
    email: "mariorossi@a.it",
    biography: ""
  })
  .expect(500)
  .expect("Content-Type", /json/)
  .end((err, res) => {
    let expectedResult = {
      error: "DUPLICATE_ENTRY"
    };
    assert.same(res.body.error, expectedResult.error, "Errore DUPLICATE_ENTRY");
    assert.end();
    process.exit(0);
  });
});