import { db } from "src/db";
import { chamado, medico } from "src/db/schema";
import type { IDoctorCreateCommand } from "./dtos/IDoctorCreateCommand";
import { count, eq } from "drizzle-orm";
import type { IDoctorEditCommand } from "./dtos/IDoctorEditCommand";
import type { IPaginationParams } from "../calls/dtos/IPaginationParams";


export class DoctorsService {

  async create(command: IDoctorCreateCommand) {
    const [newDoctor] = await db.insert(medico).values(command).returning();
    return newDoctor;
  }

  async list({ page, limit }: IPaginationParams) {
    const offset = (page - 1) * limit;
    const [doctorsOfPage, totalDoctors] = await Promise.all([
      db.query.medico.findMany({
        limit: limit,
        offset: offset,
        with: {
          chamados: {},
        }
      }),
      db.select({ count: count() }).from(medico),
    ]);
    const total = totalDoctors[0].count;
    const totalPages = Math.ceil(total / limit);
    return {
      data: doctorsOfPage,
      meta: {
        total,
        page,
        limit,
        totalPages
      }
    }
  }

  async listById(id: number) {
    const doctorById = await db.query.medico.findFirst({
      where: eq(medico.cdMedico, id),
    });
    return doctorById;
  }

  async listCallsByDoctor(id: number) {
    const callsByDoctor = await db.query.chamado.findMany({
      where: eq(chamado.cdMedico, id),
      with: {
        medico: {},
      }
    });
    return callsByDoctor;
  }

  async editDoctor(command: IDoctorEditCommand) {
    const updatedDoctor = await db.update(medico).set(command).where(eq(medico.cdMedico, command.cdMedico)).returning();
    return updatedDoctor;
  }

  async deleteDoctor(id: number) {
   const deletedDoctor = await db.delete(medico).where(eq(medico.cdMedico, id));
   return deletedDoctor;
  }
}