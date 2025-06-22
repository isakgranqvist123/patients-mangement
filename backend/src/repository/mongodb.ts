import { MongoClient, type Document } from 'mongodb';
import env from '../config/env';
import type { PatientCollection } from './patient/patient.record';
import type { UserCollection } from './user/user.record';

export type Collection = PatientCollection | UserCollection;

const client = new MongoClient(env.MONGO_URI);

export type StringId<T extends Document> = Omit<T, '_id'> & {
  _id: string;
};

export function getCollection<T extends Document>(collection: Collection) {
  return client.db().collection<T>(collection);
}

export default client;
