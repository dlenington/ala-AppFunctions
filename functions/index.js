const functions = require("firebase-functions");
const { db } = require("./util/admin");
const app = require("express")();
const FBAuth = require("./util/fbAuth");

const {
  getEvents,
  getEvent,
  getPanelData,
  likeEvent,
  unlikeEvent,
  getLikes,
} = require("./handlers/events");
const { signup, login, getAuthenticatedUser } = require("./handlers/users");

app.get("/events/:day", getEvents);
app.get("/event/:eventId", getEvent);
app.get("/panel/:panelId", getPanelData);
app.get("/panel/:panelId/like", FBAuth, likeEvent);
app.get("/panel/:panelId/unlike", FBAuth, unlikeEvent);
app.post("/signup", signup);
app.post("/login", login);
app.get("/user", FBAuth, getAuthenticatedUser);
app.get("/likes", FBAuth, getAuthenticatedUser);

exports.api = functions.https.onRequest(app);
