const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase!");
});

exports.linkCreated = functions.firestore
  .document("users/{userUid}/links/{linkID}")
  .onCreate((snapshot, context) => {
    const { userUid, linkID } = context.params;
    const { longUrl, shortCode } = snapshot.data();
    console.log(snapshot.data());

    return admin.firestore().doc(`links/${shortCode}`).set({
      userUid,
      linkID,
      longUrl,
    });
  });

exports.linkDeleted = functions.firestore
  .document("users/{userUid}/links/{linkID}")
  .onDelete((snapshot, context) => {
    const { shortCode } = snapshot.data();
    return admin.firestore().doc(`links/${shortCode}`).delete();
  });

exports.linkUpdated = functions.firestore
  .document("users/{userUid}/links/{linkID}")
  .onUpdate((change, context) => {
    const { userUid, linkID } = context.params;
    const beforeData = change.before.data();
    const afterData = change.after.data();
    const { shortCode: previousCode } = beforeData;
    const { shortCode, longUrl } = afterData;

    const deletePrevious = admin
      .firestore()
      .doc(`links/${previousCode}`)
      .delete();
    const setNew = admin.firestore().doc(`links/${shortCode}`).set({
      userUid,
      linkID,
      longUrl,
    });

    return Promise.all([deletePrevious, setNew]);
  });
