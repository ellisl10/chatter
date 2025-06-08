import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json' assert { type: "json" };

// Prevent reinitializing if the server reloads
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
export default db;