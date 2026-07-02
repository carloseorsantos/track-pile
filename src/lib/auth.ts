import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // runs in the Edge middleware too, so it must not touch Prisma directly —
    // `user` (with `plan`) is only present right after sign-in, via the adapter
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // @ts-expect-error plan comes from the Prisma-backed adapter user
        token.plan = user.plan ?? "FREE";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        // @ts-expect-error augmenting session user
        session.user.plan = token.plan ?? "FREE";
      }
      return session;
    },
  },
});
