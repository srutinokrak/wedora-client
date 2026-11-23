import { betterAuth } from "better-auth"
import { APIError, createAuthMiddleware } from "better-auth/api"
import { MongoClient } from "mongodb"
import { mongodbAdapter } from "@better-auth/mongo-adapter"

const client = new MongoClient(process.env.BETTER_AUTH_DB_URI as string)
const db = client.db("wedora")

export const auth = betterAuth({
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: true,
      },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => ({
          data: {
            ...user,
            role: user.role === "vendor" ? "vendor" : "customer",
          },
        }),
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  hooks: {
    before: createAuthMiddleware(async (context) => {
      if (
        context.path === "/update-user" &&
        Object.prototype.hasOwnProperty.call(context.body ?? {}, "role")
      ) {
        throw new APIError("FORBIDDEN", {
          message: "You cannot change your account role.",
        })
      }

      if (context.path !== "/sign-up/email") {
        return
      }

      const password = context.body?.password
      if (
        typeof password !== "string" ||
        !/[a-z]/.test(password) ||
        !/[A-Z]/.test(password)
      ) {
        throw new APIError("BAD_REQUEST", {
          message: "Password must include at least one uppercase and one lowercase letter.",
        })
      }
    }),
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  database: mongodbAdapter(db, {
    client,
  }),
})
