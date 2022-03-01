
import {app} from "./app";
import mongoose from "mongoose";
import {natsWrapper} from "./nats-wrapper";

const start = async ()=>{
    if(!process.env.JWT_KEY)
    {
        throw new Error("JWT_KEY must be defined!");
    }
    if(!process.env.MONGO_URI)
    {
        throw new Error("MONGO_URI must be defined");
    }

    if(!process.env.NAT_CLIENT_ID)
    {
        throw new Error("NAT_CLIENT_ID must be defined");
    }

    if(!process.env.NAT_URL)
    {
        throw new Error("NAT_URL must be defined");
    }

    if(!process.env.NAT_CLUSTER_ID)
    {
        throw new Error("NAT_CLUSTER_ID must be defined");
    }
    try{

        await natsWrapper.connect(process.env.NAT_CLUSTER_ID,
            process.env.NAT_CLIENT_ID,
            process.env.NAT_URL);

        natsWrapper.client.on("close",()=>process.exit());
        process.on("SIGINT",()=>natsWrapper.client!.close());
        process.on("SIGTERM",()=>natsWrapper.client!.close());

        await mongoose.connect(process.env.MONGO_URI);
    }catch(err:any){
        console.log(err);
    }
    app.listen(3000,()=>{
        console.log("Listening on port 3000!");
    });
}

start();
