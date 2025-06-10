import admin from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';


admin.initializeApp();

export const db = admin.firestore();
export const bucket = getStorage().bucket();