import 'next-auth';

declare module 'next-auth' {
  interface Session {
    firebaseToken?: string;
  }

  interface JWT {
    uid?: string;
  }
}
