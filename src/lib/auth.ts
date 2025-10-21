import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt"
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        if (credentials.password !== "notia") {
          return null;
        }

        return {
          id: credentials.email,
          email: credentials.email,
          name: credentials.email.split("@")[0]
        };
      }
    })
  ],
  pages: {
    signIn: "/login"
  }
};
