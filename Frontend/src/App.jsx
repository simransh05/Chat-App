import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./Component/Signup/Signup";
import Login from "./Component/Login/Login";
import Chat from "./Component/Chat/Chat";
import AddContact from "./Component/AddContact/AddContact";
import './App.css'

function App() {
  const info  =JSON.parse(localStorage.getItem('login-info'))
  const userId = info?.user?.id;
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path={`/chat/${userId}`} element={<Chat />} />
        <Route path="/add-contact" element={<AddContact/>}/>
      </Routes>
    </Router>
  );
}

export default App;
