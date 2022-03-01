import express,{Response,Request} from "express";
import {Ticket} from "../models/ticket";
import {NotFoundError} from "@mbticket/common";

const router = express.Router();

router.get("/api/tickets/:id",async(req:Request, res:Response)=>{
    const id = req.params.id;
    const ticket = await Ticket.findById(id);
    if(ticket)
    {
        return res.send(ticket);
    }
    throw new NotFoundError();
});

export {router as showTicketRouter}