import { User, signInWithEmailAndPassword } from 'firebase/auth';
import { AuthOptions, Awaitable } from 'next-auth';
import { FirestoreAdapter } from '@auth/firebase-adapter';

import CredentialsProvider from 'next-auth/providers/credentials';

import { auth, db, firebaseApp, firestore } from '@/actions/server/firebase';
import { cert } from 'firebase-admin/app';
import { Firestore } from 'firebase-admin/firestore';
import { firebaseAdmin } from './server/admin';

type CredentialType = {
  username: string;
  password: string;
  redirect: string;
  csrfToken: string;
  callbackUrl: string;
  json: string;
};

export const authOptions: AuthOptions = {
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {},
      authorize: async (credentials): Promise<any> => {
        try {
          const user = await signInWithEmailAndPassword(
            auth,
            (credentials as CredentialType).username || '',
            (credentials as CredentialType).password || ''
          );
          return user.user || null;
        } catch (e) {
          console.error(e);
          return null;
        }
      },
    }),
  ],
  adapter: FirestoreAdapter(firestore) as any,
  callbacks: {
    session: async ({ session, user, token }) => {
      if (token && token.jti) {
        const firebaseToken = await firebaseAdmin
          .auth()
          .createCustomToken(token.jti as string);

        session.firebaseToken = firebaseToken;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
};
