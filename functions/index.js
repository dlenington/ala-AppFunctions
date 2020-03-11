const functions = require("firebase-functions");
const { db } = require("./util/admin");
const app = require("express")();

const { getEvents, getEvent } = require("./handlers/events");

app.get("/events/:day", getEvents);
app.get("/event/:eventId", getEvent);

exports.api = functions.https.onRequest(app);
