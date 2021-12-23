import {Router,Response,Request} from 'express';
import {body, validationResult} from 'express-validator';
import {RequestValidationError} from "../errors/request-validation-error";
import {User} from "../models/user";
import {BadRequestError} from "../errors/bad-request-error";
import jwt from "jsonwebtoken";

const router = Router();

router.post('/api/users/signup',
    [
        body("email").isEmail(),
        body("password").trim().isLength({min:4,max:20})
            .withMessage("Password must be between 4 and 20 characters"),
        validationResult
    ],
    async (req:Request,res:Response)=>{

    const {email, password} = req.body;
    const existingUser = await User.findOne({email});
    if(existingUser){
        throw new BadRequestError("Email already exist!");
    }
    const user = User.build({email,password});
    await user.save();
    const token = jwt.sign({id: user.id,email:user.email},
        process.env.JWT_KEY!);
    req.session = {
        jwt: token
    };
    res.status(201).send(user);
});

export {router as signUpRouter}