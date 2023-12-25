export class DraftNotFoundError extends Error {
  static {
    this.prototype.name = 'DraftNotFoundError'
  }

  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}

export class DraftInvalidDataError extends Error {
  static {
    this.prototype.name = 'DraftInvalidDataError'
  }

  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}

export class DraftExcessiveScopeError extends Error {
  static {
    this.prototype.name = 'DraftExcessiveScopeError'
  }

  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}
