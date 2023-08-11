import { ValidationError } from 'express-validator';

class ApiError extends Error {
  public status: number;
  public errors: ValidationError[] | null;
  constructor(message: string, status: number, errors: ValidationError[] | null) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static badRequest(message: string, errors: ValidationError[] | null) {
    return new ApiError(message, 400, errors);
  }
  static forbidden(message: string, errors: ValidationError[] | null) {
    return new ApiError(message, 403, errors);
  }
  static notAuthorized(message: string, errors: ValidationError[] | null) {
    return new ApiError(message, 401, errors);
  }
}

export default ApiError;
