export const httpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type HttpStatus = (typeof httpStatus)[keyof typeof httpStatus];

export type ApiResponse<T> =
  | {
      status: HttpStatus;
      data: null;
      error: string;
    }
  | {
      status: HttpStatus;
      data: T;
      error: null;
    };
