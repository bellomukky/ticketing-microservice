import {Publisher, Subject, TicketUpdatedEvent} from "@mbticket/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    subject:Subject.TicketUpdated=Subject.TicketUpdated;
}