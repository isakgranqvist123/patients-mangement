import userRepository from '../../../repository/user/user.repository';
import { httpStatus } from '../../api.types';

async function getUsers() {
  try {
    const users = await userRepository.findAll();

    return {
      status: httpStatus.OK,
      data: users,
      error: null,
    };
  } catch (err) {
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      data: null,
      error: 'Internal server error',
    };
  }
}

export default {
  getUsers,
};
