import patientRepository, {
  PatientRecordStringId,
} from '../../../repository/patient/patient.repository';
import { ApiResponse, httpStatus } from '../../api.types';
import { z } from 'zod/v4';

async function getPatients(): Promise<
  ApiResponse<Array<PatientRecordStringId>>
> {
  const patients = await patientRepository.findAll();

  return {
    status: httpStatus.OK,
    data: patients,
    error: null,
  };
}

const createPatientSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.number({
    message: 'Date of birth is required',
  }),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  userId: z.string().min(1, 'User ID is required'),
});

async function createPatient(
  data: z.infer<typeof createPatientSchema>,
): Promise<ApiResponse<PatientRecordStringId | null>> {
  const validation = createPatientSchema.safeParse(data);
  if (!validation.success) {
    return {
      status: httpStatus.BAD_REQUEST,
      data: null,
      error: z.prettifyError(validation.error),
    };
  }

  const existingPatient = await patientRepository.findByUserId(data.userId);
  if (existingPatient) {
    return {
      status: httpStatus.CONFLICT,
      data: null,
      error: 'Patient with this user ID already exists',
    };
  }

  const patient = await patientRepository.insertOne(data);
  if (!patient) {
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      data: null,
      error: 'Failed to create patient',
    };
  }

  return {
    status: httpStatus.CREATED,
    data: patient,
    error: null,
  };
}

const updatePatientSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  dateOfBirth: z.number().optional(),
  phoneNumber: z.string().min(1, 'Phone number is required').optional(),
});

async function updatePatient(
  id: string,
  data: z.infer<typeof updatePatientSchema>,
): Promise<ApiResponse<PatientRecordStringId | null>> {
  const validation = updatePatientSchema.safeParse(data);
  if (!validation.success) {
    return {
      status: httpStatus.BAD_REQUEST,
      data: null,
      error: z.prettifyError(validation.error),
    };
  }

  const patient = await patientRepository.updateById(id, data);
  if (!patient) {
    return {
      status: httpStatus.NOT_FOUND,
      data: null,
      error: 'Patient not found',
    };
  }

  return {
    status: httpStatus.OK,
    data: patient,
    error: null,
  };
}

async function deletePatient(id: string): Promise<ApiResponse<null>> {
  if (!id) {
    return {
      status: httpStatus.BAD_REQUEST,
      data: null,
      error: 'Patient ID is required',
    };
  }

  const deleted = await patientRepository.deleteById(id);
  if (!deleted) {
    return {
      status: httpStatus.NOT_FOUND,
      data: null,
      error: 'Patient not found',
    };
  }

  return {
    status: httpStatus.NO_CONTENT,
    data: null,
    error: null,
  };
}

export default {
  getPatients,
  createPatient,
  updatePatient,
  deletePatient,
};
