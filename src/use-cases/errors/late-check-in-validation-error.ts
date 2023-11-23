export class LateCheckInValidationError extends Error {
    constructor() {
        super('Check-in can only be validated in 20 minutes after its creation.')
    }
}