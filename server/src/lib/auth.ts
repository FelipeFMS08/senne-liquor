import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "src/db/index.js";
import { jwt } from "better-auth/plugins";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite"
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [
    "http://localhost:5173",
    "http://localhost:8081",
    "https://senne-liquor.vercel.app"
  ],
  plugins: [
    jwt(),
  ]
});