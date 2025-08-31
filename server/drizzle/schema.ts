import { sqliteTable, AnySQLiteColumn, integer, text, numeric, foreignKey } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

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

