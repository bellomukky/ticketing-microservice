import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {app} from "../app";
import request from "supertest";
import jwt from "jsonwebtoken";

jest.mock("../nats-wrapper")

declare global {
    function signin(): string;
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
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();

    for(let collection of collections) {
        await collection.deleteMany({});
    }
});

afterAll(async ()=>{
    await mongoose.disconnect();
    await mongod.stop();
});

global.signin = ()=>{
    const email = "muktar@email.com";
    const payload = {id:String(new mongoose.Types.ObjectId()),email:email};
    const token = jwt.sign(payload,process.env.JWT_KEY!)

    const session = { jwt: token };

    const sessionJSON = JSON.stringify(session);
    const base64 = Buffer.from(sessionJSON).toString("base64");
    return `session=${base64}`;
};