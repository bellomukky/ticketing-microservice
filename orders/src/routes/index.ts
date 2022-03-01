import express,{Request,Response} from "express";
import {requireAuth} from "@mbticket/common";
import {Order} from "../models/orders";


const router = express.Router()

router.get("/api/orders",requireAuth,async (req:Request,res:Response)=>{
    const userId = req.currentUser!.id;

    const orders = await Order.find({userId:userId}).populate("ticket");
    res.send(orders);
});

export {router as fetchOrdersRouter}