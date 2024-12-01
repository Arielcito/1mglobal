import bcrypt from "bcrypt";
import NextAuth, { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/app/libs/prismaDB";
import GoogleProvider from "next-auth/providers/google";

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!googleClientId || !googleClientSecret) {
  throw new Error('Faltan las credenciales de Google en las variables de entorno');
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log("🔑 Iniciando proceso de autenticación");
          
          if (!credentials?.email || !credentials?.password) {
            console.error("❌ Faltan credenciales:", {
              email: !credentials?.email,
              password: !credentials?.password
            });
            throw new Error("Email y contraseña son requeridos");
          }

          console.log("🔍 Buscando usuario por email:", credentials.email);
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user) {
            console.error("❌ Usuario no encontrado:", credentials.email);
            throw new Error("Email o contraseña incorrectos");
          }

          if (!user.password) {
            console.error("❌ Usuario sin contraseña configurada");
            throw new Error("Este usuario no tiene contraseña configurada");
          }

          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isCorrectPassword) {
            console.error("❌ Contraseña incorrecta");
            throw new Error("Email o contraseña incorrectos");
          }

          return user;
        } catch (error) {
          console.error("❌ Error en authorize:", error);
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          // Aquí puedes crear o actualizar el usuario en tu base de datos
          const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: user.name,
              email: user.email,
              // Puedes generar una contraseña aleatoria o manejar esto de otra manera
              password: crypto.randomUUID(),
              provider: "google"
            })
          });

          if (!response.ok) {
            return false;
          }
        } catch (error) {
          console.error("Error during Google sign in:", error);
          return false;
        }
      }
      return true;
    },
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
