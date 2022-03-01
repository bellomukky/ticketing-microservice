import request from "supertest";
import {app} from "../../app";
import mongoose from "mongoose";
import {Ticket} from "../../models/ticket";
import {natsWrapper} from "../../nats-wrapper";

it("returns 401 for non authorized users",async ()=>{
    const ticketId = new mongoose.Types.ObjectId();
    const response = await request(app).patch( `/api/tickets/${ticketId}`)
        .send({});
    expect(response.statusCode).toBe(401);
});

it("return 400 for invalid title or price",async ()=>{
    const id = new mongoose.Types.ObjectId();
    const session = global.signin();
    await request(app).patch( `/api/tickets/${id}`)
        .set("Cookie",session)
        .send({title:"Concert"}).expect(400);
    await request(app).patch( `/api/tickets/${id}`)
        .set("Cookie",session)
        .send({price:10}).expect(400);
});

it("returns 404 for invalid tickets id",async ()=>{
    const ticketId = new mongoose.Types.ObjectId();
    const session = global.signin();
    const response = await request(app).patch( `/api/tickets/${ticketId}`)
        .set("Cookie",session).send({title:"Concert",price:10});
    expect(response.statusCode).toBe(404);
});


it("return 403 when user does not own the ticket",async ()=>{
    const userId = new mongoose.Types.ObjectId();
    const ticket = Ticket.build({userId:String(userId),title:"Concert",price:10});
    await ticket.save();
    const session = global.signin();
    const response = await request(app).patch( `/api/tickets/${ticket._id}`)
        .set("Cookie",session)
        .send({title:"Concert Updated 2",price:10});
    expect(response.statusCode).toBe(403);
});

it("updates ticket with authorized user and valid body",async ()=>{
    const cookie = global.signin();
    const createRes = await request(app).post('/api/tickets')
        .set("Cookie",cookie)
        .send({
        title:"Concert",
            price:10
    })
    expect(createRes.statusCode).toBe(201);
    const title = "Concert Updated 2";
    const price = 15;
    const response = await request(app).patch( `/api/tickets/${createRes.body.id}`)
        .set("Cookie",cookie)
        .send({title,price});
    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe(title);
    expect(response.body.price).toBe(price);
});

it("publishes an event",async()=>{
    const cookie = global.signin();
    const createRes = await request(app).post('/api/tickets')
        .set("Cookie",cookie)
        .send({
            title:"Concert",
            price:10
        })
    expect(createRes.statusCode).toBe(201);
    const title = "Concert Updated 2";
    const price = 15;
    await request(app).patch( `/api/tickets/${createRes.body.id}`)
        .set("Cookie",cookie)
        .send({title,price});

    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
})

