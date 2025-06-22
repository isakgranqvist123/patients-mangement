import type { Request, Response } from 'express';
import patientsService from './patients.service';

async function getPatients(req: Request, res: Response) {
  const result = await patientsService.getPatients();

  res.status(result.status).json(result);
}

async function createPatient(req: Request, res: Response) {
  const result = await patientsService.createPatient(req.body);

  res.status(result.status).json(result);
}

async function updatePatient(req: Request, res: Response) {
  const result = await patientsService.updatePatient(req.params.id, req.body);

  res.status(result.status).json(result);
}

async function deletePatient(req: Request, res: Response) {
  const result = await patientsService.deletePatient(req.params.id);

  res.status(result.status).json(result);
}

export default {
  getPatients,
  createPatient,
  updatePatient,
  deletePatient,
};
