export class AlreadyExistsError extends Error {
  static {
    this.prototype.name = 'AlreadyExistsError'
  }

  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}

export class NotFoundError extends Error {
  static {
    this.prototype.name = 'NotFoundError'
  }

  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}

export class InvalidDataError extends Error {
  static {
    this.prototype.name = 'InvalidDataError'
  }

  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}

export class UnexpectedBehaviorDetectedError extends Error {
  static {
    this.prototype.name = 'UnexpectedBehaviorDetectedError'
  }

  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}
