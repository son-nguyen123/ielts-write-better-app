export class StatusError extends Error {
  status?: number

  constructor(message: string, status?: number) {
    super(message)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, StatusError)
    }
    this.name = "StatusError"
    this.status = status
  }
}
