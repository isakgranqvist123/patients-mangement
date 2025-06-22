import type { ObjectId } from 'mongodb';

export type PatientCollection = 'patients';

export interface PatientRecord {
  _id: ObjectId;

  userId: ObjectId;

  firstName: string;
  lastName: string;
  dateOfBirth: number;
  phoneNumber: string;

  createdAt: number;
  updatedAt: number;
}
