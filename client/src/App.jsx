import React from "react";
import HomePage from "./pages/HomePage";
import Home from "./pages/Home";
import People from "./pages/People";
import Location from "./pages/Location";
import Reservation from "./pages/Reservation";
import Contact from "./pages/Contact";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import Login from "./pages/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import DiningRoute from "./utils/DiningRoute";
import ReservationRoute from "./utils/ReservationRoute";
import { PersistGate } from "redux-persist/integration/react";
import Register from "./pages/Register";
import PDFViewer from "./components/PDFViewer";



function App() {
  return (
    <div className="">
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor} />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<HomePage />}>
              <Route path="/" element={<Home />} />
              <Route path="/people" element={<People />} />
              <Route path="/location" element={<Location />} />
              <Route path="/contact" element={<Contact />} />
            </Route>
            <Route path="/dining" element={<DiningRoute/>} />
            <Route path="/reservation" element={<ReservationRoute/>} />
            <Route path="/iitropar-campus-map" element={<PDFViewer />} />

            {/* <Route element={<PrivateRoute />}>
              <Route path="/dining" element={<DiningRoute />} />
              <Route path="/reservation" element={<ReservationRoute />} />
            </Route> */}
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
