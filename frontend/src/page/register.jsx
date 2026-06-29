import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

export default function Register(){
    const [formdata, setFormdata] = useState({
        name : "",
        email : "",
        username : "",
        password : ""
    });
    const navigate = useNavigate();
    const handlChange = (e) =>{
        setFormdata({...formdata, [e.target.name] : e.target.value});
    }
    const handleSubmit = async (e) =>{
        e.preventDefault();
        const res = await axios.post(
            `${API_URL}/api/auth/register`,
            formdata
        );
        console.log(res.data);
        localStorage.setItem("token", res.data.token);
        navigate("/dash")
    }
    return(
        <>
        <h1>it is Register</h1>
        <form onSubmit={handleSubmit}>
            <label htmlFor="name">name:</label>
            <input type="text" name="name" onChange={handlChange} id="name" value={formdata.name} required/>

            <label htmlFor="email">email:</label>
            <input type="email" name="email" onChange={handlChange} id="email" value={formdata.email} required/>

            <label htmlFor="username">username:</label>
            <input type="text" name="username" onChange={handlChange} id="username" value={formdata.username} required/>

            <label htmlFor="password">password:</label>
            <input type="password" name="password" onChange={handlChange} id="password" value={formdata.password} required/>

            <button type="submit">Register</button>
        </form>
        </>
    );
}
