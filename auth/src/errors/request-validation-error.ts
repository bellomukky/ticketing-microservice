import {ValidationError} from "express-validator";
import {CustomError} from "./custom-error";

export class RequestValidationError extends CustomError{
    statusCode = 400;
    constructor(public errors: ValidationError[]){
        super("Invalid request body");
        //Because we are extending built in class we need to set the prototype
        Object.setPrototypeOf(this,RequestValidationError.prototype);
    }
    serializeError()
    {
        return this.errors.map(err=>{
            return {message:err.msg,field:err.param}
        })
    }
}