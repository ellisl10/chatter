import serviceAccount from './serviceAccountKey.json' assert { type: "json" };
import {admin} from 'firebase-admin';

admin.initializeApp({
    credential:admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
export { db };