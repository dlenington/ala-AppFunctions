const functions = require("firebase-functions");
const { db } = require("./util/admin");
const app = require("express")();

const { getAllEvents } = require("./handlers/events");

app.get("/events", getAllEvents);

exports.api = functions.https.onRequest(app);
