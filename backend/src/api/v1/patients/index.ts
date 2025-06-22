import express from 'express';

import patientsCtrl from './patients.controller';

const patientsRouter = express.Router();

patientsRouter.get('/', patientsCtrl.getPatients);
patientsRouter.post('/', patientsCtrl.createPatient);
patientsRouter.patch('/:id', patientsCtrl.updatePatient);
patientsRouter.delete('/:id', patientsCtrl.deletePatient);

export default patientsRouter;
