
import request from "supertest";
import {app} from "../../app";
import mongoose from "mongoose";
import {Ticket} from "../../models/tickets";
import {Order, OrderStatus} from "../../models/orders";
import {natsWrapper} from "../../nats-wrapper";

const ticketAttr = {title:"Concert",price:20};
it("return an error if ticket does not exist",async()=>{
    const ticketId = new mongoose.Types.ObjectId();
    await request(app).post("/api/orders")
        .set("Cookie",global.signin())
        .send({
        ticketId
    }).expect(404)
})


it("return an error if ticket is already reserved",async()=>{

    const ticket = Ticket.build(ticketAttr)
    await ticket.save();

    const order = Order.build({ticket:ticket,userId:"asdfghkkh",
        status:OrderStatus.Created,expiresAt: new Date()})
    await order.save();
    await request(app).post("/api/orders")
        .set("Cookie",global.signin())
        .send({
            ticketId:ticket.id
        }).expect(400)
})

it("successful reserves a ticket",async()=>{
    const ticket = Ticket.build(ticketAttr)
    await ticket.save();
    await request(app).post("/api/orders")
        .set("Cookie",global.signin())
        .send({
            ticketId:ticket.id
        }).expect(201)
})

it("publishes order created event",async ()=>{
    const ticket = Ticket.build(ticketAttr)
    await ticket.save();
    await request(app).post("/api/orders")
        .set("Cookie",global.signin())
        .send({
            ticketId:ticket.id
        }).expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1);
})