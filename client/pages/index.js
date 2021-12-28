
import axios from "axios";
const HomePage = ({currentUser})=>{

    return (
        <h1>Home Page2</h1>
    )
}

export function getServerSideProps(){

    const response  = await axios.get("/api/users/currents")
    console.log("I am on the server side")
    return {props:{currentUser:response.data.currentUser}}
}


export default HomePage;