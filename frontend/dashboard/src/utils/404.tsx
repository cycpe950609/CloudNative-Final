import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigator } from "./dashboard";

const NotFoundPage = () => {

    let {navigate} = useNavigator();
    useEffect(()=>{
        setTimeout(() => {
            navigate("/");
        },2000)
    },[])

    return (
        <div>
            <h1>404</h1>
            <Link to="/">Go back to the homepage</Link>
        </div>
    )
}

export default NotFoundPage