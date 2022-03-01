
import request from "supertest";
import {app} from "../../app";
import mongoose from "mongoose";
import {Ticket} from "../../models/tickets";
import {Order, OrderStatus} from "../../models/orders";

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
it("fetches order for a particular user",async()=>{
    const ticketOne = await buildTicket();
    const ticketTwo = await buildTicket();

    const userOne = global.signin();
    const userTwo = global.signin();

    await request(app).post("/api/orders")
        .set("Cookie",userOne)
        .send({ticketId:ticketOne.id}).expect(201)

    const {body:orderTwo} = await request(app).post("/api/orders")
        .set("Cookie",userTwo)
        .send({ticketId:ticketTwo.id}).expect(201);


    const {body} = await request(app).get("/api/orders")
        .set("Cookie",userTwo)
        .send({}).expect(200)

    expect(body[0].id).toEqual(orderTwo.id)
})







