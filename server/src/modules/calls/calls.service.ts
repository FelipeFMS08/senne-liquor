import { db } from "src/db/index.js";
import type { IPaginationParams } from "./dtos/IPaginationParams.js";
import { chamado, hospital, medico } from "src/db/schema.js";
import { and, count, eq, like, or } from "drizzle-orm/sql";
import type { ICallCreateCommand } from "./dtos/ICallCreateCommand.js";
import type { ICallEditCommand } from "./dtos/ICallEditCommand.js";


export class CallsService {

  async create(command: ICallCreateCommand) {
    const [newCall] = await db.insert(chamado).values(command).returning();

    return newCall;
  }

  async list({ page, limit, status, search }: IPaginationParams) {
    const offset = (page - 1) * limit;

    const conditions = [];
    if (status) {
      conditions.push(eq(chamado.ieStatusChamado, status));
    }
    if (search) {
      const searchTerm = `%${search}%`;
      conditions.push(or(
        like(chamado.nmPaciente, searchTerm),
        like(hospital.nmHospital, searchTerm) 
      ));
    }
    
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    

    const callsOfPage = await db.select({
        nrChamado: chamado.nrChamado,
        nmPaciente: chamado.nmPaciente,
        ieTipoChamado: chamado.ieTipoChamado,
        ieStatusChamado: chamado.ieStatusChamado,
        ieSexo: chamado.ieSexo,
        hospital: {
            cdHospital: hospital.cdHospital,
            nmHospital: hospital.nmHospital,
            nrLatitude: hospital.nrLatitude,
            nrLongitude: hospital.nrLongitude
        },
        medico: {
            cdMedico: medico.cdMedico,
            nmMedico: medico.nmMedico
        }
    })
    .from(chamado)
    .leftJoin(hospital, eq(chamado.cdHospital, hospital.cdHospital))
    .leftJoin(medico, eq(chamado.cdMedico, medico.cdMedico))
    .where(whereClause)
    .limit(limit)
    .offset(offset);

    const totalCalls = await db.select({ count: count() })
      .from(chamado)
      .leftJoin(hospital, eq(chamado.cdHospital, hospital.cdHospital)) 
      .where(whereClause); 

    const total = totalCalls[0].count;
    const totalPages = Math.ceil(total / limit);

    return {
      data: callsOfPage,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async listById(id: number) {
    const callById = await db.query.chamado.findFirst({
      where: eq(chamado.nrChamado, id),
      with: {
        medico: {},
        hospital: {}
      }
    });

    return callById;
  }

   async editCall(id: number, data: ICallEditCommand) {
    const updatedCall = await db.update(chamado).set(data).where(eq(chamado.nrChamado, id)).returning();
    return updatedCall;
  }
  
    async deleteCall(id: number) {
      const deletedCall = await db.delete(chamado).where(eq(chamado.nrChamado, id)).returning();
      return deletedCall;
  }
}