export class ArticleAlreadyExistsError extends Error {
  static {
    this.prototype.name = 'ArticleAlreadyExistsError'
  }

  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}

export class ArticleNotFoundError extends Error {
  static {
    this.prototype.name = 'ArticleNotFoundError'
  }

  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}

export class ArticleInvalidDataError extends Error {
  static {
    this.prototype.name = 'ArticleInvalidDataError'
  }

  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}

export class ArticleExcessiveScopeError extends Error {
  static {
    this.prototype.name = 'ArticleExcessiveScopeError'
  }

  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}
