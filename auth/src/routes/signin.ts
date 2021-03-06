import {Router,Response,Request} from 'express';
import {body} from "express-validator";
import {User} from "../models/user";
import {BadRequestError,validateRequest} from "@mbticket/common";
import {Password} from "../services/password";
import jwt from "jsonwebtoken";

const router = Router();

router.post('/api/users/signin',[
    body("email").isEmail().withMessage("Email must be valid!"),
    body("password").trim().notEmpty().withMessage("Password is required"),
    validateRequest
],async (req:Request,res:Response)=>{
    const {email,password} = req.body;
    const user = await User.findOne({email});
    if(user)
    {
        const passwordMatch = await Password.compare(user.password,password);
        if(passwordMatch)
        {
            const token = jwt.sign({id: user.id,email:user.email},
                process.env.JWT_KEY!);
            req.session = {
                jwt: token
            };
            return res.status(200).send(user);
        }
    }
    throw new BadRequestError("Invalid email and password combination");
});

export {router as signInRouter}