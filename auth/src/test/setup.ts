import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {app} from "../app";
import request from "supertest";

declare global {
    function signin(): Promise<string[]>;
}

let mongod: MongoMemoryServer;
beforeAll(async()=>{
    process.env.JWT_KEY = "asdfasdf";
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    mongod = await MongoMemoryServer.create();
    const mongoUri = mongod.getUri();
    await mongoose.connect(mongoUri);
});

beforeEach(async () => {

    const collections = await mongoose.connection.db.collections();

    for(let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async ()=>{
    await mongoose.disconnect();
    await mongod.stop();
});

global.signin = async ()=>{
    const email = "muktar@email.com";
    const password = "password";
    const response = await request(app).post("/api/users/signup")
        .send({email,password})
        .expect(201);
    return response.get("Set-Cookie");

};