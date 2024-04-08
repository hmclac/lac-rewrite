'use client';
import { getApps, initializeApp } from '@firebase/app';
import { firebaseConfig } from '@/actions/global';
import { getAuth, signInWithCustomToken } from '@firebase/auth';
import { getFirestore } from '@firebase/firestore';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export const firebase =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(firebase);
export const db = getFirestore(firebase);

export const useFirebaseAuth = () => {
  const { data: session } = useSession();
  useEffect(() => {
    if (session?.firebaseToken) {
      signInWithCustomToken(auth, session.firebaseToken).catch((e) => {
        console.error('Error signing in with custom token:', e);
      });
    }
  }, [session?.firebaseToken]);
};
