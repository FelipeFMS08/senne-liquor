import type { Request, Response } from "express";
import { CallsService } from "./calls.service.js";
import type { ICallCreateCommand } from "./dtos/ICallCreateCommand.js";
import type { ICallEditCommand } from "./dtos/ICallEditCommand.js";

export class CallsController {

  async create(req: Request, res: Response) {
    const data: ICallCreateCommand = req.body;
    const callsService = new CallsService();

    try {
      const result = await callsService.create(data);
      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao criar chamado'});
    }
    
  }

  async list(req: Request, res: Response) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const status = req.query.status as string | undefined;
    const search = req.query.search as string | undefined;

    const callsService = new CallsService();

    try {
    const result = await callsService.list({ page, limit, status, search });
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao buscar chamados'});
    }
  }

  async listById(req: Request, res: Response) {
    const id = Number(req.params.id)
    const callsService = new CallsService();

    try {
      const result = await callsService.listById(id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao buscar chamado por ID'});
    }
  }

  async editCall(req: Request, res: Response) {
    const id = Number(req.params.id);
    const data: ICallEditCommand = req.body;
    const callsService = new CallsService();
    try {
      const result = await callsService.editCall(id, data);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao editar chamado'});
    }
  }

  async deleteCall(req: Request, res: Response) {
    const id = Number(req.params.id);
    const callsService = new CallsService();
    try {
      const result = await callsService.deleteCall(id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao deletar chamado'});
    }
  }
}