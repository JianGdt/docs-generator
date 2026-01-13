import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { signInSchema } from './validators';
import { getUserByEmail } from './database';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        try {
          // Validate input with Zod
          const { email, password } = await signInSchema.parseAsync(credentials);
          
          // Get user from database
          const user = await getUserByEmail(email);
          
          if (!user) {
            throw new Error('Invalid email or password');
          }

          // Verify password
          const passwordsMatch = await bcrypt.compare(password, user.password);
          
          if (!passwordsMatch) {
            throw new Error('Invalid email or password');
          }

          // Return user object (without password)
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      
      // Handle session updates
      if (trigger === 'update' && session) {
        token.name = session.name;
        token.email = session.email;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  debug: process.env.NODE_ENV === 'development',
});