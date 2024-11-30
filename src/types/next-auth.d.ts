import type { DefaultSession, DefaultUser } from "next-auth"
import type { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      is_admin: boolean
      username: string
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    is_admin: boolean
    username: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    is_admin?: boolean
    username?: string
  }
}
