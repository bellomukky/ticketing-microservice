import express, { Request,Response } from "express";
import "express-async-errors";
import {json} from "body-parser";


import {currentUser, errorHandler, NotFoundError} from "@mbticket/common";

import cookieSession from "cookie-session";
import {createTicketRouter} from "./routes/new";
import {showTicketRouter} from "./routes/show";
import {listTicketsRouter} from "./routes";
import {updateTicketRouter} from "./routes/update";

const app = express();
app.set("trust proxy",true);
app.use(json());

app.use(cookieSession({
    signed:false,
    secure:false
}));

app.use(currentUser);
app.use(listTicketsRouter);
app.use(showTicketRouter);
app.use(createTicketRouter);
app.use(updateTicketRouter);


app.all("*",()=>{
    throw new NotFoundError();
});

app.use(errorHandler);

export {app};