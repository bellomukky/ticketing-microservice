
export abstract class CustomError extends Error {
    protected constructor(message:string){
        super(message);
        Object.setPrototypeOf(this,CustomError.prototype);
    }
    abstract statusCode: number;
    abstract serializeError():{message:string;field?:string}[];
}
