'use client';

import React from 'react';
import { SessionProvider as Provider } from 'next-auth/react';
import { Session } from 'next-auth';

type AuthContextType = {
  session: Session | null;
  setSession: React.Dispatch<React.SetStateAction<Session | null>>;
};

export type UserType = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

// export const AuthContext = createContext<AuthContextType | undefined>(
//   undefined
// );

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

type Props = {
  children: React.ReactNode;
  session: Session | null;
};

export const AuthProvider = ({
  children,
  session,
}: Props): React.ReactElement => {
  // const [currentSession, setCurrentSession] = useState<Session | null>(session);

  return (
    <Provider session={session}>
      {/* <AuthContext.Provider */}
      {/* value={{ session: currentSession, setSession: setCurrentSession }} */}
      {/* > */}
      {children}
      {/* </AuthContext.Provider> */}
    </Provider>
  );
};
