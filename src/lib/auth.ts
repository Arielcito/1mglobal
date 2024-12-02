import { prisma } from "@/app/libs/prismaDB";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type AuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import bcrypt from "bcrypt";
import type { User } from "@prisma/client";

// Validar variables de entorno requeridas
const requiredEnvs = {
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ?? '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ?? '',
} as const;

// Verificar que todas las variables de entorno necesarias estén presentes
for (const [key, value] of Object.entries(requiredEnvs)) {
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciales inválidas");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Usuario no encontrado");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordCorrect) {
          throw new Error("Contraseña incorrecta");
        }

        return {
          ...user,
          role: user.role
        };
      },
    }),
    GoogleProvider({
      clientId: requiredEnvs.GOOGLE_CLIENT_ID,
      clientSecret: requiredEnvs.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST || "",
        port: Number(process.env.EMAIL_SERVER_PORT) || 587,
        auth: {
          user: process.env.EMAIL_SERVER_USER || "",
          pass: process.env.EMAIL_SERVER_PASSWORD || "",
        },
      },
      from: process.env.EMAIL_FROM || "noreply@example.com",
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
    async signIn({ user, account, profile }) {
      try {
        if (account?.provider === "google" && user.email) {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
            include: { 
              accounts: true,
              stream: true 
            }
          });

          if (!existingUser) {
            const baseUsername = (user.name?.replace(/\s+/g, '') || user.email.split('@')[0]);
            const username = await generateUniqueUsername(baseUsername);

            await prisma.$transaction(async (prisma) => {
              const newUser = await prisma.user.create({
                data: {
                  email: user.email,
                  name: profile?.name || user.name || null,
                  username,
                  image: profile?.image || user.image || null,
                  stream: {
                    create: {
                      name: `${profile?.name || user.name || 'User'}'s stream`,
                    }
                  }
                },
              });

              if (account) {
                await prisma.account.create({
                  data: {
                    userId: newUser.id,
                    type: account.type,
                    provider: account.provider,
                    providerAccountId: account.providerAccountId,
                    access_token: account.access_token || null,
                    expires_at: account.expires_at || null,
                    token_type: account.token_type || null,
                    scope: account.scope || null,
                    id_token: account.id_token || null,
                    session_state: account.session_state || null
                  },
                });
              }
            });
          } else if (!existingUser.accounts.some(acc => acc.provider === account.provider) && account) {
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token || null,
                expires_at: account.expires_at || null,
                token_type: account.token_type || null,
                scope: account.scope || null,
                id_token: account.id_token || null,
                session_state: account.session_state || null
              },
            });

            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                name: profile?.name || user.name || null,
                image: profile?.image || user.image || null,
              }
            });
          }

          if (existingUser && !existingUser.stream) {
            await prisma.stream.create({
              data: {
                name: `${user.name || 'User'}'s stream`,
                userId: existingUser.id,
              }
            });
          }
        }
        return true;
      } catch (error) {
        console.error("SignIn error:", error);
        return false;
      }
    },
    async session({ session, token }) {
      if (session?.user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            username: true
          }
        });
        
        if (dbUser) {
          session.user = {
            ...session.user,
            id: dbUser.id,
            username: dbUser.username,
            role: dbUser.role
          };
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = 'is_admin' in user ? (user.is_admin ? 'ADMIN' : 'USER') : 'USER';
      }
      return token;
    },
  },
};

const generateUniqueUsername = async (baseUsername: string): Promise<string> => {
  let username = baseUsername;
  let counter = 1;
  
  while (await prisma.user.findUnique({ where: { username } })) {
    username = `${baseUsername}${counter}`;
    counter++;
  }
  
  return username;
};

export const getSelf = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      username: true,
      role: true
    },
  });

  return user;
};
