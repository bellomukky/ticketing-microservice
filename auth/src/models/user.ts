import mongoose from "mongoose";
import {Password} from "../services/password";

interface UserAttrs{
    email:string;
    password:string;
}

interface UserModel extends mongoose.Model<UserDocument> {
    build(userAttrs: UserAttrs):UserDocument;
}

interface UserDocument extends mongoose.Document{
    email:string;
    password:string;
}

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique:true
    },
    password:{
        type: String,
        required: true
    }
},{
    toJSON:{
        transform(doc,ret){
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
        },
        versionKey:false
    }
});

userSchema.pre("save",async function(done){
    const user = this as UserDocument;
    if(user.isModified("password")){
        user.password = await Password.toHash(user.password);
    }
    done();
})

userSchema.statics.build  = (attr: UserAttrs)=>{
    return new User(attr);
}



const User = mongoose.model<UserDocument,UserModel>("User",userSchema);

User.build({
    email:"test@test.com",
    password:"password"
})

export {User};