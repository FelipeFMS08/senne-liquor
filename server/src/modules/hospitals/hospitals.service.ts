import { db } from "src/db";
import type { IPaginationParams } from "../calls/dtos/IPaginationParams";
import { count, eq } from "drizzle-orm/sql";
import { chamado, hospital } from "src/db/schema";
import type { IHospitalCreateCommand } from "./dtos/IHospitalCreateCommand";
import type { IHospitalEditCommand } from "./dtos/IHospitalEditCommand";

export class HospitalsService {

  async create(command: IHospitalCreateCommand) {
    const [newHospital] = await db.insert(hospital).values(command).returning();
    return newHospital;
  }

  async list({ page, limit }: IPaginationParams) {
    const offset = (page - 1) * limit;
    const [hospitalsOfPage, totalHospitals] = await Promise.all([
      db.query.hospital.findMany({
        limit: limit,
        offset: offset,
        with: {
          chamados: {},
        }
      }),
      db.select({ count: count() }).from(hospital),
      ]);
      const total = totalHospitals[0].count;
      const totalPages = Math.ceil(total / limit);
      return {
        data: hospitalsOfPage,
        meta: {
          total,
          page,
          limit,
          totalPages
        }
      }
  }

  async listById(id: number) {
    const hospitalById = await db.query.hospital.findFirst({
      where: eq(hospital.cdHospital, id),
      with: {
        chamados: {},
      }
    });
    return hospitalById;
  }

  async listCallsByHospital(id: number) {
    const callsByHospital = await db.query.chamado.findMany({
      where: eq(chamado.cdHospital, id),
      with: {
        hospital: {}
      }
    });
    return callsByHospital;
  }

  async editHospital(command: IHospitalEditCommand) {
    const [updatedHospital] = await db.update(hospital).set(command).where(eq(hospital.cdHospital, command.cdHospital)).returning();
    return updatedHospital;
  }

  async deleteHospital(id: number) {
    const deletedHospital = await db.delete(hospital).where(eq(hospital.cdHospital, id)).returning();
    return deletedHospital;
  }

}