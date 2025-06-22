import type { ObjectId } from 'mongodb';

export type UserCollection = 'users';

export interface UserRecord {
  _id: ObjectId;

  email: string;
  password: string;

  createdAt: number;
  updatedAt: number;
}
