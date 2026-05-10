import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    if (serviceAccountKey) {
      const serviceAccount = JSON.parse(serviceAccountKey);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else if (clientEmail && privateKey && projectId) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } else {
      console.warn('Firebase Admin credentials are not fully defined.');
    }
  } catch (error: any) {
    console.error('Firebase Admin initialization error:', error.message);
  }
}

export const adminDb = admin.apps.length ? admin.firestore() : null;
export const adminAuth = admin.apps.length ? admin.auth() : null;
export { admin };
