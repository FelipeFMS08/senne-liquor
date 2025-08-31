import { relations } from "drizzle-orm/relations";
import { medico, chamado, hospital } from "./schema";

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