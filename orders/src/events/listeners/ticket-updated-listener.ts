import {Listener, NotFoundError, Subject, TicketUpdatedEvent} from "@mbticket/common";
import {Message} from "node-nats-streaming";
import {queueGroupName} from "./queue-group-name";
import {Ticket} from "../../models/tickets";

export class TicketUpdatedListener extends  Listener<TicketUpdatedEvent>
{
    subject:Subject.TicketUpdated = Subject.TicketUpdated;
    queueGroupName= queueGroupName;
    async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
        const ticket = await Ticket.findOne({_id:data.id,version:data.version-1});
        if(!ticket)
        {
            throw new NotFoundError();
        }
        const {title,price} = data;
        ticket.set({title,price});
        await ticket.save();
        msg.ack();
    }
}