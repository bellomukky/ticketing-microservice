import {OrderCancelledEvent, Publisher, Subject} from "@mbticket/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>
{
    subject:Subject.OrderCancelled = Subject.OrderCancelled;
}