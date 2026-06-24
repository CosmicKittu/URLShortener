import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login(){
    const [formdata, setFormdata] = useState({
        username : "",
        password : ""
    })
    const navigate = useNavigate();
    const handlChange = (e) =>{
        setFormdata({...formdata, [e.target.name] : e.target.value});
    }
    const handleSubmit = async (e) =>{
        e.preventDefault();
        const res = await axios.post(
            "http://localhost:5000/api/auth/login",
            formdata
        );
        console.log(res.data);
        localStorage.setItem("token", res.data.token);
        navigate("/dash");
    }
    return(

        <>
        <h1>it is Login</h1>

        <form onSubmit={handleSubmit}>

            <label htmlFor="username">username:</label>
            <input type="text" name="username" onChange={handlChange} id="username" value={formdata.username} required/>

            <label htmlFor="password">password:</label>
            <input type="password" name="password" onChange={handlChange} id="password" value={formdata.password} required/>

            <button type="submit">Login</button>
        </form>
        </>
    );
}