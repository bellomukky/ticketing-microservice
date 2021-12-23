import {CustomError} from "./custom-error";

export class NotAuthorizedError extends CustomError {
    constructor()
    {
        super("User Unauthorized");
        Object.setPrototypeOf(this,NotAuthorizedError.prototype);
    }
    statusCode= 401;
    serializeError() {
        return [{message:"Unauthorized"}];
    }
}