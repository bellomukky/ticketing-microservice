
import request from "supertest";
import {app} from "../../app";
import mongoose from "mongoose";
import {Ticket} from "../../models/tickets";
import {Order, OrderStatus} from "../../models/orders";
import {natsWrapper} from "../../nats-wrapper";

const ticketAttr = {title:"Concert",price:20};

it("returns 401 for unauthorized user",async()=>{
    const orderId = new mongoose.Types.ObjectId();
    const response = await request(app).get(`/api/orders/${orderId}`)
        .send()
    expect(response.statusCode).toBe(401)
});

const buildTicket = async ()=>{
    const ticket = Ticket.build({
        title: 'concert'+String(new mongoose.Types.ObjectId()),
        price: Math.ceil(Math.random()*100),
    });
    await ticket.save();
    return ticket;
}
it("cancels ticket for a user",async()=>{
    const ticketOne = await buildTicket();


    const userOne = global.signin();

    const {body:order} = await request(app).post("/api/orders")
        .set("Cookie",userOne)
        .send({ticketId:ticketOne.id}).expect(201)
    const response = await request(app).delete(`/api/orders/${order.id}`)
        .set("Cookie",userOne)
        .send({}).expect(204)

    await request(app).post("/api/orders")
        .set("Cookie",userOne)
        .send({ticketId:ticketOne.id}).expect(201)

})

it("publishes an event for cancel ticket",async()=>{
    const ticketOne = await buildTicket();


    const userOne = global.signin();

    const {body:order} = await request(app).post("/api/orders")
        .set("Cookie",userOne)
        .send({ticketId:ticketOne.id}).expect(201)

    const response = await request(app).delete(`/api/orders/${order.id}`)
        .set("Cookie",userOne)
        .send({}).expect(204)

    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
})







