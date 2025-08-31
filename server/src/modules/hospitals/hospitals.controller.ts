import type { Request, Response } from "express";
import { HospitalsService } from "./hospitals.service.js";
import type { IHospitalCreateCommand } from "./dtos/IHospitalCreateCommand.js";
import type { IHospitalEditCommand } from "./dtos/IHospitalEditCommand.js";


export class HospitalsController {

  async create(req: Request, res: Response) {
    const command: IHospitalCreateCommand = req.body;

    const hospitalsService = new HospitalsService();

    try {
      const newHospital = await hospitalsService.create(command);
      res.status(201).json(newHospital);
    } catch (error) {
      res.status(500).json({ error: "Failed to create hospital" });
    }
  }

  async list(req: Request, res: Response) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const hospitalsService = new HospitalsService();

    try {
      const hospitals = await hospitalsService.list({ page, limit });
      return res.status(200).json(hospitals);
    } catch (error) {
      res.status(500).json({ error: "Failed to list hospitals" });
    }
  }

  async listById(req: Request, res: Response) {
    const id = Number(req.params.id);

    const hospitalsService = new HospitalsService();

    try {
      const hospital = await hospitalsService.listById(id);
      return res.status(200).json(hospital);
    } catch (error) {
      res.status(500).json({ error: "Failed to list hospital by ID" });
    }
  }

  async listCallsByHospital(req: Request, res: Response) {
      const id = Number(req.params.id);
    const hospitalsService = new HospitalsService();
      try {
        const calls = await hospitalsService.listCallsByHospital(id);
        return res.status(200).json(calls);
      } catch (error) {
        return res.status(500).json({ message: 'Erro ao listar chamados do médico pelo hospital.' })
      }
  }

  async editHospital(req: Request, res: Response) {
    const command: IHospitalEditCommand = req.body;

    const hospitalsService = new HospitalsService();

    try {
      const updatedHospital = await hospitalsService.editHospital(command);
      return res.status(200).json(updatedHospital);
    } catch (error) {
      res.status(500).json({ error: "Failed to edit hospital" });
    }
  }

  async deleteHospital(req: Request, res: Response) {
    const id = Number(req.params.id);
    
    const hospitalsService = new HospitalsService();

    const deletedHospital = await hospitalsService.deleteHospital(id);
    return res.status(200).json(deletedHospital);
  }
}