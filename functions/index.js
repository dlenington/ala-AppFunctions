const functions = require("firebase-functions");
const { db } = require("./util/admin");
const app = require("express")();

const { getEvents, getEvent, getPanelData } = require("./handlers/events");
const { signup } = require("./handlers/users");

app.get("/events/:day", getEvents);
app.get("/event/:eventId", getEvent);
app.get("/panel/:panelId", getPanelData);
app.post("/signup", signup);

exports.api = functions.https.onRequest(app);
