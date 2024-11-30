import bcrypt from "bcrypt";
import NextAuth, { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/app/libs/prismaDB";

export const authOptions: AuthOptions = {
  providers: [
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

          console.log("🔐 Verificando contraseña...");
          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isCorrectPassword) {
            console.error("❌ Contraseña incorrecta");
            throw new Error("Email o contraseña incorrectos");
          }

          console.log("✅ Autenticación exitosa para:", user.email);
          return {
            id: user.id,
            email: user.email,
            name: user.username,
            username: user.username,
            is_admin: user.is_admin,
          };
          
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
        session.user.is_admin = token.is_admin as boolean;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.is_admin = user.is_admin;
      }
      return token;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
