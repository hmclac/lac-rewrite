'use client';
import { getApps, initializeApp } from '@firebase/app';
import { firebaseConfig } from '@/actions/global';
import { getAuth } from '@firebase/auth';
import { getFirestore } from '@firebase/firestore';

export const firebase =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(firebase);
export const db = getFirestore(firebase);
