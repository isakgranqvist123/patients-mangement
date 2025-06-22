import { ObjectId } from 'mongodb';
import { getCollection } from '../mongodb';
import { UserRecord } from './user.record';

async function insertOne(
  user: Omit<UserRecord, '_id' | 'createdAt' | 'updatedAt'>,
) {
  const collection = getCollection<UserRecord>('users');

  const result = await collection.insertOne({
    _id: new ObjectId(),
    email: user.email,
    password: user.password,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  if (result.acknowledged) {
    return {
      ...user,
      _id: result.insertedId.toString(),
    };
  }

  return null;
}

async function findByEmail(email: string) {
  const collection = getCollection<UserRecord>('users');

  const user = await collection.findOne({ email });

  if (!user) {
    return null;
  }

  return {
    ...user,
    _id: user?._id.toString(),
  };
}

async function findById(id: string) {
  const collection = getCollection<UserRecord>('users');

  const user = await collection.findOne({ _id: new ObjectId(id) });

  if (!user) {
    return null;
  }

  return {
    ...user,
    _id: user?._id.toString(),
  };
}

async function findAll() {
  const collection = getCollection<UserRecord>('users');

  const users = await collection.find().project({ password: 0 }).toArray();

  return users.map((user) => ({
    ...user,
    _id: user._id.toString(),
  }));
}

export default {
  insertOne,
  findByEmail,
  findById,
  findAll,
};
