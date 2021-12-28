import request from "supertest";
import {app} from "../../app";

describe("signin",()=>{
    it("fails on invalid credentials",async()=>{
        await request(app).post("/api/users/signin")
            .send({
                email:"invalid@email.com",
                password:"password"
            }).expect(400);
    });

    it("fails on invalid password",async()=>{
        await request(app).post("/api/users/signup")
            .send({
                email:"valid@email.com",
                password:"password"
            }).expect(201);

        await request(app).post("/api/users/signin")
            .send({
                email:"valid@email.com",
                password:"12345678"
            }).expect(400);
    });

    it("returns cookie on successful signin",async()=>{
        await request(app).post("/api/users/signup")
            .send({
                email:"valid@email.com",
                password:"password"
            }).expect(201);

       const response  = await request(app).post("/api/users/signin")
            .send({
                email:"valid@email.com",
                password:"password"
            }).expect(200);

       expect(response.get("Set-Cookie")).toBeDefined();
    });
})
