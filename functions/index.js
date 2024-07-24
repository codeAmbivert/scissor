const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.linkCreated = functions.firestore
  .document("users/{userUid}/links/{linkId}")
  .onCreate(async (snapshot, context) => {
    const { userUid, linkId } = context.params;
    const { longUrl, shortCode } = snapshot.data();

    // console.log(`New link created by ${userUid}: ${short} -> ${longUrl}`);
    return admin.firestore().doc(`links/${shortCode}`).set({
      userUid,
      linkId,
      longUrl,
    });
  });

exports.linkDeleted = functions.firestore
  .document("users/{userUid}/links/{linkId}")
  .onDelete(async (snapshot, context) => {
    const { shortCode } = snapshot.data();

    return admin.firestore().doc(`links/${shortCode}`).delete();
  });
