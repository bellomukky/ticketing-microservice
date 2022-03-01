
import axios from "../lib/axios";
const HomePage =  ({currentUser})=>{
    return (
         currentUser?
        <h1>You are signed in</h1>
        :<h1>You are not signed in</h1>
    )
}

HomePage.getInitialProps = async (context)=>{

    const response  = await axios(context).get("/api/users/currentuser")
    return {currentUser:response.data.currentUser}
}

export default HomePage;

