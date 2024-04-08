import assert from 'assert';
assert(typeof window === 'undefined');

import * as admin from 'firebase-admin';
import { getApps, initializeApp, cert } from 'firebase-admin/app';

export const firebaseAdmin = (() => {
  if (admin.apps.length === 0) {
    const project_id = process.env.FIREBASE_ADMIN_PROJECT_ID!;
    const client_email = process.env.FIREBASE_ADMIN_CLIENT_EMAIL!;
    const private_key = process.env.FIREBASE_ADMIN_PRIVATE_KEY!;
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: project_id,
        clientEmail: client_email,
        privateKey: private_key.replace(/\\n/g, '\n'),
      }),
    });
  }
  return admin;
})();
