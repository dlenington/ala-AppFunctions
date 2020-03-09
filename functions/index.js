const functions = require("firebase-functions");
const { db } = require("./util/admin");
const app = require("express")();

const { getAllEvents, getEvent } = require("./handlers/events");

app.get("/events", getAllEvents);
app.get("/events/:eventId", getEvent);

exports.api = functions.https.onRequest(app);
