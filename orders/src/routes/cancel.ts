
import express,{Request,Response} from "express";
import {ForbiddenError, NotFoundError, requireAuth, validateRequest} from "@mbticket/common";
import {Order, OrderStatus} from "../models/orders";
import {param} from "express-validator";

import mongoose from "mongoose";
import {OrderCancelledPublisher} from "../events/publishers/order-cancelled-publisher";
import {natsWrapper} from "../nats-wrapper";

const router = express.Router()

router.delete("/api/orders/:orderId",requireAuth,
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
    order.status = OrderStatus.Cancelled;
    await order.save();
    await new OrderCancelledPublisher(natsWrapper.client).publish({
        id:order.id,
        ticket:{
            id:order.ticket.id
        }
    })
    res.status(204).send(order);
});

export {router as cancelOrderRouter}