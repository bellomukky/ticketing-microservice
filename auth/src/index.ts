import express, { Request,Response } from "express";
import "express-async-errors";
import {json} from "body-parser";
import {currentUserRouter} from "./routes/current-user";
import {signInRouter} from "./routes/signin";
import {signUpRouter} from "./routes/signup";
import {signOutRouter} from "./routes/signout";

import {errorHandler} from "./middlewares/error-handler";
import {NotFoundError} from "./errors/not-found-error";
import mongoose from "mongoose";

const app = express();

app.use(json());

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.all("*",()=>{
    throw new NotFoundError();
});

app.use(errorHandler);

const start = async ()=>{
    try{
        await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
    }catch(err:any){
        console.log(err);
    }
    app.listen(3000,()=>{
        console.log("Listening on port 3000!");
    });
}

start();
