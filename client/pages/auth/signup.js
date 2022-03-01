import {useState} from 'react';
import Router from "next/router";
import useRequest from "../../hooks/use-request";


export default ()=>{
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const {doRequest,errors} = useRequest({
        url:"/api/users/signup",
        method:"post",
        body:{email,password},
        onSuccess: ()=> Router.push("/")
    })
    const onSubmit = async (e)=>{
        e.preventDefault();
    
        await doRequest();
        
    }
    return (
        <form onSubmit={onSubmit}>
            <h1>Sign Up</h1>
            <div className="form-group">
                <label htmlFor="">Email address</label>
                <input value={email} onChange={e=>setEmail(e.target.value)} type="email"
                       className={"form-control"}/>
                       <p className={"text-danger"}>{
                           errors.find(error=>error.field==="email" || !error.field)?.message
                       }</p>
            </div>
            <div className="form-group">
                <label htmlFor="">Password</label>
                <input value={password} type="password" onChange={e=>setPassword(e.target.value)}
                       className={"form-control"}/>
                <p className={"text-danger"}>{errors.find(error=>error.field==="password")?.message}</p>
            </div>
            <button className={"btn btn-primary"}>Sign up</button>
        </form>
    )
}