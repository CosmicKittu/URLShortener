import { Link } from "react-router-dom";

export default function Home(){
    return(
        <>
        <h1>it is Home</h1>
        <Link to="/login">Login</Link>
        <Link to="/dash">Dash</Link>
        <Link to="/register">Register</Link>
        <Link to="/">Home</Link>
        </>
    );
}