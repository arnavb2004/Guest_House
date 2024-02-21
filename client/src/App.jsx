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
// import PrivateRoute from "./utils/PrivateRoute";

function App() {
  return (
    <div className="">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<HomePage />}>
            <Route path="/" element={<Home />} />
            <Route path="/people" element={<People />} />
            <Route path="/location" element={<Location />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
          {/* <Route element={<PrivateRoute />}> */}
            <Route path="/dining" element={<Dining />} />
            <Route path="/reservation" element={<Reservation />} />
          {/* </Route> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
