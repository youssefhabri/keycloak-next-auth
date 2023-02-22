import NextAuth from 'next-auth';
import { JWT } from 'next-auth/jwt';
import KeycloakProvider from 'next-auth/providers/keycloak';

const keycloak = KeycloakProvider({
  id: 'keycloak',
  clientId: process.env.AUTH_CLIENT_ID!,
  clientSecret: process.env.AUTH_CLIENT_SECRET!,
  issuer: process.env.AUTH_ISSUER,
  authorization: { params: { scope: 'openid email profile roles' } },
});

// this performs the final handshake for the keycloak
// provider, the way it's written could also potentially
// perform the action for other providers as well
async function doFinalSignOutHandshake(jwt: JWT) {
  const { provider, id_token } = jwt;

  if (provider === keycloak.id) {
    // Add the id_token_hint to the query string
    const params = new URLSearchParams();
    params.append('id_token_hint', id_token as string);

    const issuer = keycloak.options!.issuer;
    const url = `${issuer}/protocol/openid-connect/logout?${params.toString()}`;
    const result = await fetch(url);
    const { status, statusText } = result;

    if (result.ok) {
      console.log('Completed post-logout handshake', status, statusText);
    } else {
      console.error(
        'Unable to perform post-logout handshake',
        status || statusText
      );
    }
  }
}

export default NextAuth({
  providers: [keycloak],
  callbacks: {
    async jwt({ account, token }) {
      if (account) {
        token.id_token = account.id_token;
        token.provider = account.provider;
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub!;

      return session;
    },
  },
  events: {
    signOut: ({ token }) => doFinalSignOutHandshake(token),
  },
});
