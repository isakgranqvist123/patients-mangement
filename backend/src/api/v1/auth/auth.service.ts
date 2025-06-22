import z from 'zod/v4';
import bcrypt from 'bcrypt';
import userRepository from '../../../repository/user/user.repository';
import { ApiResponse, httpStatus } from '../../api.types';
import jwt from '../../../utils/jwt';

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

async function refreshToken(userId: string) {
  try {
    const token = jwt.sign(userId);

    return {
      status: httpStatus.OK,
      data: token,
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

async function login(
  data: z.infer<typeof loginSchema>,
): Promise<ApiResponse<string | null>> {
  try {
    const validation = loginSchema.safeParse(data);
    if (!validation.success) {
      return {
        status: httpStatus.BAD_REQUEST,
        data: null,
        error: z.prettifyError(validation.error),
      };
    }

    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      return {
        status: httpStatus.BAD_REQUEST,
        data: null,
        error: 'User not found',
      };
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      return {
        status: httpStatus.BAD_REQUEST,
        data: null,
        error: 'Invalid password',
      };
    }

    const token = jwt.sign(user._id);

    return {
      status: httpStatus.OK,
      data: token,
      error: null,
    };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return {
        status: httpStatus.BAD_REQUEST,
        data: null,
        error: z.prettifyError(err),
      };
    }

    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      data: null,
      error: 'Internal server error',
    };
  }
}

async function register(
  data: z.infer<typeof registerSchema>,
): Promise<ApiResponse<string | null>> {
  try {
    const validation = registerSchema.safeParse(data);
    if (!validation.success) {
      return {
        status: httpStatus.BAD_REQUEST,
        data: null,
        error: z.prettifyError(validation.error),
      };
    }

    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      return {
        status: httpStatus.CONFLICT,
        data: null,
        error: 'User already exists',
      };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await userRepository.insertOne({
      email: data.email,
      password: hashedPassword,
    });
    if (!user) {
      return {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        data: null,
        error: 'Failed to create user',
      };
    }

    const token = jwt.sign(user._id);

    return { status: httpStatus.CREATED, data: token, error: null };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return {
        status: httpStatus.BAD_REQUEST,
        data: null,
        error: z.prettifyError(err),
      };
    }

    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      data: null,
      error: 'Internal server error',
    };
  }
}

export default {
  refreshToken,
  login,
  register,
};
