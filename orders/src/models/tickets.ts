import mongoose from "mongoose";
import {Order,OrderStatus} from "./orders";
import {updateIfCurrentPlugin} from "mongoose-update-if-current"

interface TicketAttrs{
    id:string;
    price: number;
    title:string;
}

export interface TicketDocument extends mongoose.Document {
    price: number;
    title:string;
    version:number;
    isReserved:()=>Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDocument> {
    build:(attrs: TicketAttrs)=>TicketDocument;
}

const ticketSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true,
        min:0
    }
},
    {
        toJSON:{
            transform(doc,ret){
                ret.id = ret._id;
                delete ret._id;
            }
        }
    });

ticketSchema.set("versionKey","version");
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: TicketAttrs): TicketDocument=>{
    const {id,...otherAttrs} = attrs;
    return new Ticket({
        ...otherAttrs,_id:id
    });
}

ticketSchema.methods.isReserved = async function(){
    const existingOrder = await Order.findOne({
        ticket:this as any,
        status:{
            $in: [ OrderStatus.Created,OrderStatus.AwaitingPayment,
                OrderStatus.Completed, ],
        }
    })
    return !!existingOrder
}

const Ticket  = mongoose.model<TicketDocument,TicketModel>("Ticket",ticketSchema);

export {Ticket}