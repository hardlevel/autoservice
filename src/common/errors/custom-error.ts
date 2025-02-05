import { PrismaService } from "../../prisma/prisma.service";

export class CustomError extends Error {
    code: string | number;
    cause: any;
    category: string;
    startDate: string;
    endDate: string;
    params: any;
    time: string;

    constructor(
        message: string,
        code: string | number | null = null,
        category: string,
        time: string,
        params: any = null,
        cause: any = null
    ) {
        super(message);
        this.name = this.constructor.name;
        this.code = code;
        this.message = message;
        this.category = category;
        this.params = params;
        this.time = time;
        this.cause = cause
        Error.captureStackTrace(this, this.constructor);
    }
}