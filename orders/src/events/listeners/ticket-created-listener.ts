import {Listener, Subject, TicketCreatedEvent} from "@mbticket/common";
import {Message} from "node-nats-streaming";
import {queueGroupName} from "./queue-group-name";
import {Ticket} from "../../models/tickets";

export class TicketCreatedListener extends  Listener<TicketCreatedEvent>
{
    subject:Subject.TicketCreated= Subject.TicketCreated;
    queueGroupName= queueGroupName;

    async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
        const ticket = Ticket.build(data);
        await ticket.save();
        msg.ack();
    }
}