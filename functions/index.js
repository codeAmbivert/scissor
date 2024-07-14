/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const { onRequest } = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");
// const { firestore } = require("@/app/firebase");
// const { doc } = require("firebase/firestore");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", { structuredData: true });
//   response.send("Hello from Firebase!");
// });

// exports.linkCreated = functions.firestore
//   .document("users/{userUid}/links/{linkId}")
//   .onCreate(async (snap, context) => {
//     console.log(snap.data());
//   });

const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.linkCreated = functions.firestore
  .document("users/{userUid}/links/{linkId}")
  .onCreate(async (snapshot, context) => {
    const { userUid, linkId } = context.params;
    const { longUrl, shortCode } = snapshot.data();
    // console.log(context);

    // If you plan to perform asynchronous operations, make sure to await them.
    // For example, updating a document in response to the creation event:
    // await admin.firestore().collection('someCollection').doc('someDoc').update({ ... });
    return admin.firestore().doc(`links/${shortCode}`).set({
      userUid,
      linkId,
      longUrl,
    });
    //  Promise.resolve(); // Return a promise or value to indicate successful completion.
  });

exports.linkDeleted = functions.firestore
  .document("users/{userUid}/links/{linkId}")
  .onDelete(async (snapshot, context) => {
    const { shortCode } = snapshot.data();
    // console.log(context);

    // If you plan to perform asynchronous operations, make sure to await them.
    // For example, updating a document in response to the creation event:
    // await admin.firestore().collection('someCollection').doc('someDoc').update({ ... });
    return admin.firestore().doc(`links/${shortCode}`).delete();
    //  Promise.resolve(); // Return a promise or value to indicate successful completion.
  });
