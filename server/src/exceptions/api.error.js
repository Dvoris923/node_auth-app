export class ApiError extends Error {
  constructor({ message, status, errors }) {
    super(message);

    this.status = status;
    this.errors = errors;
  }

  static badRequest(message, errors) {
    return new ApiError({
      message,
      errors,
      status: 400,
    });
  }

  static unauthorized(errors) {
    return new ApiError({
      message: 'unauthorized user',
      errors,
      status: 401,
    });
  }

  static notFount(errors) {
    return new ApiError({
      message: 'not Fount',
      errors,
      status: 404,
    });
  }
}
