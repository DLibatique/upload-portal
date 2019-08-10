import * as admin from "firebase-admin";
const serviceAccount = require("./serviceAccountKey.json");

export function initFirebase() {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "https://doc-upload-8c9d0.firebaseio.com"
  });
};
