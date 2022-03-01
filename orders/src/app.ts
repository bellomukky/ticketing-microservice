import express, { Request,Response } from "express";
import "express-async-errors";
import {json} from "body-parser";


import {currentUser, errorHandler, NotFoundError} from "@mbticket/common";

import cookieSession from "cookie-session";
import {createOrderRouter} from "./routes/new";
import {fetchOrdersRouter} from "./routes/index";
import {showOrderRouter} from "./routes/show";
import {cancelOrderRouter} from "./routes/cancel";


const app = express();
app.set("trust proxy",true);
app.use(json());

app.use(cookieSession({
    signed:false,
    secure:false
}));

//Middleware to add the use that logged in on the request object
app.use(currentUser);

app.use(createOrderRouter);
app.use(fetchOrdersRouter);
app.use(showOrderRouter);
app.use(cancelOrderRouter);

app.all("*",()=>{
    throw new NotFoundError();
});

app.use(errorHandler);

export {app};