import {useState} from "react";
import axios from "axios";

export default ({method,url,body,onSuccess})=>{
    const [errors,setErrors] = useState([]);
    const doRequest = async ()=>{
        try{
            const response  = await axios[method](url,body);
            setErrors([]);
            if(onSuccess)
            {
                onSuccess(response.data)
            }
            return response.data;
        }catch(err)
        {
            setErrors(err.response.data.errors)
        }
    }
    return {doRequest,errors}
}