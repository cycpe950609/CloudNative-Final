import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const NotFoundPage = () => {

    let navigate = useNavigate();
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