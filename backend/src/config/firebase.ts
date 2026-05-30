import admin from 'firebase-admin';
import { env } from './env';

if (!admin.apps.length) {
  try {
    if (env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    } else {
      admin.initializeApp();
    }
  } catch (e) {
    // If initialization fails, rethrow to make error visible during startup
    throw e;
  }
}

export { admin };
