import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

// Initialize admin if not already initialized (useful in local testing)
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

/**
 * Firestore trigger to recompute aggregated rating for a location when a new review is created.
 * Reviews are stored in the top-level collection 'reviews' with a field 'locationId'.
 */
export const onReviewCreated = functions.firestore
  .document("reviews/{reviewId}")
  .onCreate(async (snap, context) => {
    const review = snap.data();
    const locationId = review?.locationId;
    if (!locationId) {
      functions.logger.warn("Review without locationId", {
        reviewId: context.params.reviewId,
      });
      return;
    }

    const locRef = db.collection("locations").doc(locationId);

    // Use a transaction to update the aggregate efficiently
    await db.runTransaction(async (tx) => {
      const locSnap = await tx.get(locRef);
      const prev = locSnap.exists ? locSnap.data() : {};
      const prevCount = (prev?.ratingsCount as number) || 0;
      const prevAvg = (prev?.averageRating as number) || 0;

      const newCount = prevCount + 1;
      const newAvg = (prevAvg * prevCount + (review.rating || 0)) / newCount;

      tx.set(
        locRef,
        { ratingsCount: newCount, averageRating: newAvg },
        { merge: true }
      );
    });
  });

/**
 * Optional HTTP function to accept review submissions from the client
 * and write to Firestore. Validates payload and returns created review.
 * This function is an alternative to writing directly from the client and
 * allows server-side validation + authentication checks.
 */
export const createReview = functions.https.onRequest(async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  try {
    const { locationId, rating, text, userId, userName } = req.body;
    if (!locationId || !rating) {
      res.status(400).send("Missing required fields");
      return;
    }

    const review = {
      locationId,
      rating: Number(rating),
      text: text || null,
      authorId: userId || null,
      authorName: userName || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection("reviews").add(review);
    const created = await docRef.get();
    res.status(201).json({ id: docRef.id, ...created.data() });
  } catch (err) {
    functions.logger.error("createReview error", err);
    res.status(500).send("Internal Server Error");
  }
});
