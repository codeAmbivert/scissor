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

exports.linkUpdated = functions.firestore
  .document(`users/{userUid}/links/{linkId}`)
  .onUpdate(async (change, context) => {
    const { userUid, linkId } = context.params;
    const newValue = change.after.data();
    const { shortCode: newShortCode } = newValue;

    // Reference to the original document
    const originalDocRef = admin
      .firestore()
      .doc(`users/${userUid}/links/${linkId}`);
    // Reference to the shortCode document
    const shortCodeDocRef = admin.firestore().doc(`links/${newShortCode}`);

    // Perform both updates
    const updateOriginalDoc = originalDocRef.update({
      shortCode: newShortCode,
    });

    const updateShortCodeDoc = shortCodeDocRef.set({
      userUid,
      linkId,
      longUrl: newValue.longUrl,
    });
    

    // Wait for both updates to complete
    return Promise.all([updateOriginalDoc, updateShortCodeDoc]);
  });
