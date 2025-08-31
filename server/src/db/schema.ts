import { sqliteTable, AnySQLiteColumn, integer, text, numeric, foreignKey } from "drizzle-orm/sqlite-core"
import { relations } from "drizzle-orm/relations";

export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
});

export const jwks = sqliteTable("jwks", {
  id: text("id").primaryKey(),
  publicKey: text("public_key").notNull(),
  privateKey: text("private_key").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const hospital = sqliteTable("HOSPITAL", {
  cdHospital: integer("CD_HOSPITAL").primaryKey(),
  nmHospital: text("NM_HOSPITAL").notNull(),
  nrLatitude: numeric("NR_LATITUDE").notNull(),
  nrLongitude: numeric("NR_LONGITUDE").notNull(),
});

export const medico = sqliteTable("MEDICO", {
  cdMedico: integer("CD_MEDICO").primaryKey(),
  nmMedico: text("NM_MEDICO").notNull(),
});

export const chamado = sqliteTable("CHAMADO", {
  nrChamado: integer("NR_CHAMADO").primaryKey(),
  cdHospital: integer("CD_HOSPITAL").notNull().references(() => hospital.cdHospital),
  ieTipoChamado: numeric("IE_TIPO_CHAMADO"),
  nmPaciente: text("NM_PACIENTE"),
  ieSexo: text("IE_SEXO"),
  ieStatusChamado: text("IE_STATUS_CHAMADO"),
  cdMedico: integer("CD_MEDICO").references(() => medico.cdMedico),
});

export const chamadoRelations = relations(chamado, ({one}) => ({
	medico: one(medico, {
		fields: [chamado.cdMedico],
		references: [medico.cdMedico]
	}),
	hospital: one(hospital, {
		fields: [chamado.cdHospital],
		references: [hospital.cdHospital]
	}),
}));

export const medicoRelations = relations(medico, ({many}) => ({
	chamados: many(chamado),
}));

export const hospitalRelations = relations(hospital, ({many}) => ({
	chamados: many(chamado),
}));

