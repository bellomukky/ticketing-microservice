import {OrderCreatedEvent, Publisher, Subject} from "@mbticket/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>
{
    subject:Subject.OrderCreated = Subject.OrderCreated;
}