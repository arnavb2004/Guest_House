

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

