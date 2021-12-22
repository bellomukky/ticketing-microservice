import {Router,Response,Request} from 'express';


const router = Router();

router.get('/api/users/signout',(req:Request,res:Response)=>{
    res.send("Hello World to Signout");
});

export {router as signOutRouter}