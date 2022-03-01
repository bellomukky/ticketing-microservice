import express,{Request,Response} from "express";
import {ForbiddenError, NotFoundError, requireAuth, validateRequest} from "@mbticket/common";
import {Order} from "../models/orders";
import {param} from "express-validator";
import mongoose from "mongoose";


const router = express.Router()

router.get("/api/orders/:orderId",requireAuth,
    [param("orderId").custom(
        (input:string)=>
            mongoose.Types.ObjectId.isValid(input))
        .withMessage("Order id is not valid"),validateRequest],
    async (req:Request,res:Response)=>{
    const userId = req.currentUser!.id;
    const orderId = req.params.orderId;
    const order = await Order.findById(orderId).populate("ticket");
    if(!order)
    {
        throw new NotFoundError();
    }
    if(order.userId !== userId)
    {
        throw new ForbiddenError()
    }
    res.send(order);
});

export {router as showOrderRouter}