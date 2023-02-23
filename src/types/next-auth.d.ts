import NextAuth, { DefaultSession } from 'next-auth';
import { KeycloakProfile } from 'next-auth/providers/keycloak';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      roles: string[];
    } & DefaultSession['user'];
  }

  // interface KeycloakProfile {
  //   realm_access?: {
  //     roles: string[];
  //   };
  // }
}

declare module 'jose' {
  interface JWTPayload {
    realm_access?: {
      roles: string[];
    };
  }
}
