import request from "supertest";
import {app} from "../../app";
import {Ticket} from "../../models/ticket";
import {natsWrapper} from "../../nats-wrapper";

it("has a route handler listening to /api/tickets post requests",async()=>{
    const response = await request(app).post("/api/tickets").send({});
    expect(response.statusCode).not.toEqual(404);
});

it("can only be access if the user is signed in",async()=>{
    const response = await request(app).post("/api/tickets").send({});
    expect(response.statusCode).toEqual(401);
});

it("return non 401 status for authorized user",async()=>{
    const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({});
    expect(response.statusCode).not.toEqual(401);
});

it("returns an error if invalid title is provided",async()=>{
   await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
            title:"",
            price:10
        }).expect(400);
  await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
            price:10
        }).expect(400);
});

it("returns an error if invalid price is provided",async()=>{
    await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
            title:"assddfg",
            price:-10
        }).expect(400);
    await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
            title:"assddfg",
        }).expect(400);
});

it("creates ticket with valid request body",async()=>{
    let tickets = await Ticket.find({});
    expect(tickets.length).toBe(0);
   const response = await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
            title:"Ticket title",
            price:10
        });
    expect(response.statusCode).toBe(201);
    tickets = await Ticket.find({});
    expect(tickets.length).toBe(1);
});

it("executes the publish events",async()=>{
    await request(app)
        .post("/api/tickets")
        .set("Cookie", global.signin())
        .send({
            title:"Ticket title",
            price:10
        });

    expect(natsWrapper.client.publish).toHaveBeenCalledTimes(1);
})