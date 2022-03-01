import request from "supertest";
import {app} from "../../app";
import {Ticket} from "../../models/ticket";
import mongoose from "mongoose";

it("returns 404 if the ticket is not found",async ()=>{
    const id = new mongoose.Types.ObjectId();
   const response = await request(app).get(`/api/tickets/${id}`)
       .send();
   expect(response.statusCode).toBe(404);
});

it("returns returns ticket if found",async ()=>{
    const ticket = Ticket.build({title:"Concert",price:20,userId:"asfjhfjdf"})
    const savedTicket = await ticket.save()
    await request(app).get(`/api/tickets/${String(savedTicket._id)}`)
        .send({}).expect(200);
});