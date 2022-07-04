var admin = require("firebase-admin");

var serviceAccount = require("../lostandfoud-15355-firebase-adminsdk-vrrej-43471adf4e.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://lostandfoud-15355.firebaseio.com",
});

const bucket = admin.storage().bucket("gs://lostandfoud-15355.appspot.com");

const database = admin.database();
const firestore = admin.firestore();
module.exports = {
  bucket,
  database,
  firestore,
};
