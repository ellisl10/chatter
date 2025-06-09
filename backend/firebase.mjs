import admin from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';
import {readFile} from 'fs/promises';

const serviceAccount = JSON.parse(
  await readFile(new URL('./serviceAccountKey.json', import.meta.url))
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'chatter-24302.firebasestorage.app'
});

export const db = admin.firestore();
export const bucket = getStorage().bucket();