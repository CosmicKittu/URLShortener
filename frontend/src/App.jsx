import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dash from "./page/dashboared";
import Login from "./page/login";
import Register from "./page/register";
import Home from "./page/home";

export default function(){
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element = {<Register />}/>
        <Route path="/dash" element = {<Dash />}/>
      </Routes>
    </ BrowserRouter>
  );
};