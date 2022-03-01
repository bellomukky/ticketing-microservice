import "bootstrap/dist/css/bootstrap.css";
import axios from "../lib/axios";
import Header from "../components/header";
const AppComponent = ({Component, pageProps,currentUser})=>{
    return (
        <div>
            <Header currentUser={currentUser} />
            <Component {...pageProps} currentUser={currentUser} />
        </div>
    )
}

AppComponent.getInitialProps = async (appContext)=>{
   const {data} = await axios(appContext.ctx).get("/api/users/currentuser")
    let pageProps = {};
   if(appContext.Component.getInitialProps)
   {
       pageProps = appContext.Component.getInitialProps(appContext.ctx)
   }
   return {pageProps,...data}
}

export default AppComponent;