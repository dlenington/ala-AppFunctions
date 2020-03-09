var admin = require("firebase-admin");
var serviceAccount = require("./key-config.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ala-app.firebaseio.com",
  storageBucket: "ala-app.appspot.com"
});

const db = admin.firestore();

module.exports = { admin, db };
