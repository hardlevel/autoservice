export class CustomError extends Error {
    code: string|number;
    cause: any;
    category: string;
    startDate: string;
    endDate: string;

    constructor(message: string, code: string|number, cause: any, category: string, startDate: string = null, endDate: string = null) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.cause = cause;
        Error.captureStackTrace(this, this.constructor);
    }
}