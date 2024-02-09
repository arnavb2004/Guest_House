import react from "react";
import HomePage from "./pages/HomePage";
import Header from "./components/Header";
import Menu from './components/Menu';
import Footer from "./components/Footer";
import backgroundImage from "./images/backgroundImage.jpeg";



import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";

function App() {
  return <div className="">
    <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />
      {/* <Route path="/home" element={<Login />} /> */}

    </Routes>
    
    </BrowserRouter>
  </div>;
}

export default App;

