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
import ReservationForm from "./pages/Reservation_Form";
import RecordList from "./components/RecordList";
import BookDining from "./pages/BookDining";
import AdminHomePage from "./pages/AdminHomePage";
import AdminRoute from "./utils/AdminRoute";
import UserList from "./components/UserList";
import Cart from "./pages/Cart";
import RecordPage from "./pages/RecordPage";

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
            <Route path="/dining" element={<DiningRoute/>} >
                
              <Route path='' element={<RecordList/>} />
              <Route path='book-dining' element={<BookDining/>} />
              <Route path='cart' element={<Cart/>} />

            </Route>
            <Route path="/reservation" element={<ReservationRoute/>} >
              
              <Route path='' element={<RecordList/>} />
              <Route path='reservation-form' element={<ReservationForm/>} />
              <Route path=':id' element={<RecordPage />} />

            </Route>
            <Route path="/admin" element={<AdminRoute />}>
              <Route path='' element={<RecordList />} />
              <Route path="users" element={<UserList />} />
              {/* <Route path="/reservations" element={<ReservationList />} /> */}
            </Route>
            <Route path="/iitropar-campus-map" element={<PDFViewer />} />
            <Route path="/reservation-form" element={<ReservationForm />} />
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

