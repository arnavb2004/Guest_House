import react from "react";
import HomePage from "./pages/HomePage";
import Contact from "./pages/Contact";
import Registration from "./pages/Registration";
import Location from "./pages/Location";
import Dining from "./pages/Dining";
import People from "./pages/People";

import backgroundImage from "./images/backgroundImage.jpeg";



import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";

function App() {
  return <div className="flex flex-col h-screen bg-cover" style={{ backgroundImage: `url(${backgroundImage})` }}>
    <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={<HomePage />} />

      <Route path="/dining" element={<Dining />} />
      <Route path="/people" element={<People />} />
      <Route path="/location" element={<Location />} />
      <Route path="/registration" element={<Registration />} />
      <Route path="/contact" element={<Contact />} />


      {/* <Route path="/home" element={<Login />} /> */}
    </Routes>
    
    </BrowserRouter>
  </div>;
}

export default App;

