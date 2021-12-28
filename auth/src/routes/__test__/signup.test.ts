
import request from "supertest";
import {app} from "../../app";

jest.useRealTimers();

describe("signin",()=>{
    it("returns 201 on successful signup",  async () =>{
          return request(app)
              .post('/api/users/signup')
              .send({
                  email: "email@gmail.com",
                  password: "password"
              }).expect(201);

    });

    it("returns 400 for invalid email",  async () =>{
        return request(app)
            .post('/api/users/signup')
            .send({
                email: "rubbish",
                password: "password"
            }).expect(400);

    })

    it("returns 400 for invalid password",  async () =>{
        return request(app)
            .post('/api/users/signup')
            .send({
                email: "rubbish",
                password: "p"
            }).expect(400);

    })

    it("returns 400 for missing email and password",  async () =>{
        await request(app)
            .post('/api/users/signup')
            .send({email:"password@email.com"}).expect(400);

        await request(app)
            .post('/api/users/signup')
            .send({password:"password"}).expect(400);

    })

    it("returns 400 for duplicate email",  async () =>{
        await request(app)
            .post('/api/users/signup')
            .send({email:"password@email.com",
                password:"password"})
            .expect(201);

        await request(app)
            .post('/api/users/signup')
            .send({email:"password@email.com",
                password:"password"}).expect(400);

    })

    it("it sets cookie on successful registration",async ()=>{

        const response = await request(app)
            .post('/api/users/signup')
            .send({email:"password@email.com",
                password:"password"})
            .expect(201);

        expect(response.get("Set-Cookie")).toBeDefined();
    });
})