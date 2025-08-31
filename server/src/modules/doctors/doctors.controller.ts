import type { Request, Response } from "express";
import { DoctorsService } from "./doctors.service.js";
import type { IDoctorCreateCommand } from "./dtos/IDoctorCreateCommand.js";
import type { IDoctorEditCommand } from "./dtos/IDoctorEditCommand.js";

export class DoctorsController {

  async create(req: Request, res: Response) {
    const command: IDoctorCreateCommand = req.body;

    const doctorsService = new DoctorsService();

    try {
      const newDoctor = await doctorsService.create(command);
      return res.status(201).json(newDoctor);
    } catch(error) {
      return res.status(500).json({ message: 'Erro ao criar um médico.'})
    }
  }

   async list(req: Request, res: Response) {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
  
      const doctorsService = new DoctorsService();
  
      try {
        const doctors = await doctorsService.list({ page, limit });
        return res.status(200).json(doctors);
      } catch (error) {
        res.status(500).json({ error: "Falha ao listar médicos!" });
      }
    }

    async listById(req: Request, res: Response) {
    
      const id = Number(req.params.id);
      const doctorsService = new DoctorsService();
      try {
        const doctor = await doctorsService.listById(id);
        return res.status(200).json(doctor);
      } catch (error) {
        return res.status(500).json({ message: 'Erro ao listar médico por ID.' })
      }
    }

    async listCallsByDoctor(req: Request, res: Response) {
      const id = Number(req.params.id);
      const doctorsService = new DoctorsService();
      try {
        const calls = await doctorsService.listCallsByDoctor(id);
        return res.status(200).json(calls);
      } catch (error) {
        return res.status(500).json({ message: 'Erro ao listar chamados do médico.' })
      }
    }

    async editDoctor(req: Request, res: Response) {
      const command: IDoctorEditCommand = req.body;
      const doctorsService = new DoctorsService();
      try {
        const updatedDoctor = await doctorsService.editDoctor(command);
        return res.status(200).json(updatedDoctor);
      } catch (error) {
        return res.status(500).json({ message: 'Erro ao editar médico.' })
      }
    }

    async deleteDoctor(req: Request, res: Response) {
      const id = Number(req.params.id);
      const doctorsService = new DoctorsService();
      try {
        const deletedDoctor = await doctorsService.deleteDoctor(id);
        return res.status(200).json(deletedDoctor);
      } catch (error) {
        return res.status(500).json({ message: 'Erro ao deletar médico.' })
      }
    }
}