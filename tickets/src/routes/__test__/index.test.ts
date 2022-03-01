import request from "supertest";
import {app} from "../../app";
import {Ticket} from "../../models/ticket";
import mongoose from "mongoose";

it("has a valid route handler for tickets index",async()=>{
    await request(app).get("/api/tickets")
        .send({}).expect(200);
});

it("returns lists of tickets",async()=>{
    const userId = new mongoose.Types.ObjectId();
    const ticket = Ticket.build({userId:String(userId),title:"Concert",price:10})
    await ticket.save();
    const response = await request(app).get("/api/tickets")
        .send();
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined()
    expect(response.body.length).toBeGreaterThan(0)
});