import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

export default function Dash(){
    // { originalUrl, customAlias, withUsername = false }
    const [shortAurl, setShortAurl] = useState({
        originalUrl : "",
        isCustom : false,
        customAlias : "",
        withUsername : false,
    })
    const [shortUrl, setShortUrl] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    useEffect(()=>{
        const token = localStorage.getItem("token");
        if(!token){
            navigate("/login");
        }
    }, []);
    const handleUrlshort = async (e)=>{
        const {name, type, value, checked} = e.target;
        if(type === 'checkbox'){
            setShortAurl((prev)=>({...prev, [name] : checked}));
        }else{
            setShortAurl((prev)=>({...prev, [name] : value}));
        } 
    }
    const handleLogout = ()=>{
        localStorage.removeItem("token");
        navigate("/login");
    }
    const handleshort = async (e)=>{
        e.preventDefault();
        setError("");
        setShortUrl("");

        const token = localStorage.getItem("token");
        if(!token){
            navigate("/login");
            return;
        }

        const data = {
            originalUrl : shortAurl.originalUrl,
            withUsername : shortAurl.withUsername,
        }
        if(shortAurl.isCustom){
            data.customAlias = shortAurl.customAlias;
        }

        try {
            const res = await axios.post(
                `${API_URL}/api/urls/shorten`,
                data,
                {
                    headers : {
                        Authorization : `Bearer ${token}`,
                    },
                }
            );

            setShortUrl(res.data.data.shortUrl);
            console.log(res.data.data.shortUrl)
        } catch (error) {
            setError(error.response?.data?.message || "Failed to create short URL");
        }
    }
    return(
        <>
        <h1>it is dash</h1>
        <button onClick={handleLogout}>Logout</button>
        <form onSubmit={handleshort}>
            {/* original Url,  iscustom , cumstomname, withwsername*/}
            <label htmlFor="originalUrl">Your Url</label>
            <input type="text" value={shortAurl.originalUrl} onChange={handleUrlshort} required name="originalUrl"/>

            <label htmlFor="isCustom">is Custom</label>
            <input type="checkbox" checked={shortAurl.isCustom} onChange={handleUrlshort} name="isCustom"/>

            <label htmlFor="customAlias">Your custom</label>
            <input type="text" value={shortAurl.customAlias} onChange={handleUrlshort} name="customAlias" required={shortAurl.isCustom}/>

            <label htmlFor="withUsername">with username </label>
            <input type="checkbox" checked={shortAurl.withUsername} onChange={handleUrlshort} name="withUsername"/>


            <button type="submit">short</button>

            {shortUrl && <p>Short URL: <a href={shortUrl} target="_blank" rel="noreferrer">{shortUrl}</a></p>}
            {error && <p>{error}</p>}
            
        </form>
        </>
    );
}
