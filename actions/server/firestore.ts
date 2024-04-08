'use server';
import assert from 'assert';
assert(typeof window === 'undefined');

import { auth, db } from '@/actions/server/firebase';

import { Session } from 'next-auth';
import { signInWithCustomToken } from 'firebase/auth';

export const syncFirebaseAuthServer = async (session: Session | null) => {
  if (session?.firebaseToken) {
    try {
      await signInWithCustomToken(auth, session.firebaseToken);
      return true;
    } catch (error) {
      console.error('Error syncing Firebase Auth:', error);
      return false;
    }
  }
  return false;
};
