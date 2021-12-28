import request from "supertest";
import {app} from "../../app";

describe("current user",()=>{
   it("returns current user details",async ()=>{
        const token = await global.signin();

       const userResponse = await request(app)
           .get("/api/users/currentuser")
           .set("Cookie",token).expect(200);

       expect(userResponse.body.currentUser.email)
           .toBe("muktar@email.com")
   });

    it("returns not null when unauthorized",async ()=>{
        const userResponse = await request(app)
            .get("/api/users/currentuser")
            .expect(200);

        expect(userResponse.body.currentUser)
            .toBeNull()
    });
});
