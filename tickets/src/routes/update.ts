import express,{Response,Request} from "express";
import {Ticket} from "../models/ticket";
import {ForbiddenError, NotFoundError, requireAuth, validateRequest} from "@mbticket/common";
import {body} from "express-validator";
import {natsWrapper} from "../nats-wrapper";
import {TicketUpdatedPublisher} from "../events/publishers/ticket-updated-publisher";

const router = express.Router();

router.patch("/api/tickets/:id",requireAuth,
    [
        body("title").not().isEmpty().withMessage("Title field is required"),
        body("price").isFloat({gt:0}).withMessage("The price field must be greater than 0")
    ]
    ,validateRequest, async(req:Request, res:Response)=>{
    const userId = req.currentUser!.id;
    const ticketId = req.params.id;
    const ticket = await Ticket.findById(ticketId);
    const {title,price} = req.body;
    if(!ticket)
    {
        throw new NotFoundError();
    }
    if(ticket.userId !== userId)
    {
        throw new ForbiddenError();
    }
    ticket.title = title;
    ticket.price = price;
    await ticket.save();
    await new TicketUpdatedPublisher(natsWrapper.client).publish({
        id:ticket.id,
        title: ticket.title,
        price: ticket.price,
        version:ticket.version,
        userId: ticket.userId
    });
    res.send(ticket);
});

export {router as updateTicketRouter}