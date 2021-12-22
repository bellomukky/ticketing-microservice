import {Router,Response,Request} from 'express';


const router = Router();

router.get('/api/users/signin',(req:Request,res:Response)=>{
    res.send("Hello World to Signin");
});

export {router as signInRouter}