
import {Router,Response,Request} from 'express';


const router = Router();

router.get('/api/users/currentuser',(req:Request,res:Response)=>{
    res.send("Hello World");
});

export {router as currentUserRouter}