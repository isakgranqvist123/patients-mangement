import { ObjectId } from 'mongodb';
import { getCollection, StringId } from '../mongodb';
import { PatientRecord } from './patient.record';

export type PatientRecordStringId = Omit<StringId<PatientRecord>, 'userId'> & {
  userId: string;
};

async function insertOne(
  patient: Omit<PatientRecordStringId, '_id' | 'createdAt' | 'updatedAt'>,
): Promise<PatientRecordStringId | null> {
  const collection = getCollection<PatientRecord>('patients');

  const result = await collection.insertOne({
    ...patient,
    _id: new ObjectId(),
    userId: new ObjectId(patient.userId),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  if (result.acknowledged) {
    return {
      ...patient,
      _id: result.insertedId.toString(),
      userId: patient.userId.toString(),
      updatedAt: Date.now(),
      createdAt: Date.now(),
    };
  }

  return null;
}

async function findById(id: string): Promise<PatientRecordStringId | null> {
  const collection = getCollection<PatientRecord>('patients');

  const patient = await collection.findOne({ _id: new ObjectId(id) });

  if (!patient) {
    return null;
  }

  return {
    ...patient,
    userId: patient.userId.toString(),
    _id: patient._id.toString(),
  };
}

async function findByUserId(
  userId: string,
): Promise<PatientRecordStringId | null> {
  const collection = getCollection<PatientRecord>('patients');

  const patient = await collection.findOne({ userId: new ObjectId(userId) });

  if (!patient) {
    return null;
  }

  return {
    ...patient,
    userId: patient.userId.toString(),
    _id: patient._id.toString(),
  };
}

async function updateById(
  id: string,
  patient: Partial<Omit<PatientRecord, '_id'>>,
): Promise<PatientRecordStringId | null> {
  const collection = getCollection<PatientRecord>('patients');

  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...patient,
        updatedAt: Date.now(),
      },
    },
  );

  if (result.modifiedCount === 0) {
    return null;
  }

  return findById(id);
}

async function deleteById(id: string): Promise<boolean> {
  const collection = getCollection<PatientRecord>('patients');

  const result = await collection.deleteOne({ _id: new ObjectId(id) });

  return result.deletedCount > 0;
}

async function findAll(): Promise<PatientRecordStringId[]> {
  const collection = getCollection<PatientRecord>('patients');

  const patients = await collection.find().toArray();

  return patients.map((patient) => ({
    ...patient,
    userId: patient.userId.toString(),
    _id: patient._id.toString(),
  }));
}

export default {
  insertOne,
  findById,
  findByUserId,
  updateById,
  deleteById,
  findAll,
};
