export class TagNotFoundError extends Error {
  static {
    this.prototype.name = 'TagNotFoundError'
  }

  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}

export class TagAlreadyExistsError extends Error {
  static {
    this.prototype.name = 'TagAlreadyExistsError'
  }

  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}

export class TagInvalidDataError extends Error {
  static {
    this.prototype.name = 'TagInvalidDataError'
  }

  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}

export class TagExcessiveScopeError extends Error {
  static {
    this.prototype.name = 'TagExcessiveScopeError'
  }

  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}
