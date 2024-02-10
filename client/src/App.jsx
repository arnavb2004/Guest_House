import React from "react";
import HomePage from "./pages/HomePage";
import Home from "./pages/Home";
import Dining from "./pages/Dining";
import People from "./pages/People";
import Location from "./pages/Location";
import Reservation from "./pages/Reservation";
import Contact from "./pages/Contact";

import Login from "./pages/Login";

import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<HomePage />} >
            <Route path="/" element={<Home />} />
            <Route path="/dining" element={<Dining />} />
            <Route path="/people" element={<People />} />
            <Route path="/location" element={<Location />} />
            <Route path="/reservation" element={<Reservation />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
          {/* <Route path="/menu" element={<Menu />} />
          </Route> */}

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
