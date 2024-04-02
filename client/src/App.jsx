import React from "react";
import HomePage from "./pages/HomePage";
import Home from "./pages/Home";
import People from "./pages/People";
import Location from "./pages/Location";
import Reservation from "./pages/Reservation";
import Contact from "./pages/Contact";

import Login from "./pages/Login";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Register from "./pages/Register";
import PDFViewer from "./components/PDFViewer";
import ReservationForm from "./pages/Reservation_Form";
import RecordList from "./components/RecordList";
import BookDining from "./pages/BookDining";
import UserList from "./components/UserList";
import Cart from "./pages/Cart";
import RecordPage from "./pages/RecordPage";
import AdminRecordList from "./components/AdminRecordList";
import DiningList from "./components/DiningList";
import DiningRecordPage from "./pages/DiningRecordPage";
import Auth from "./utils/Auth";
import Dining from "./pages/Dining";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import Reserve from "./components/Reserve";
import RoomBooking from "./pages/RoomBooking";
import AdminRecordPage from "./pages/AdminRecordPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

function App() {
  return (
    <div className="">
      <ToastContainer />

      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route path="/" element={<HomePage />}>
            <Route path="/" element={<Home />} />
            <Route path="/people" element={<People />} />
            <Route path="/location" element={<Location />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          <Route path="admin" element={<Auth allowedRoles={["ADMIN"]} />}>
            <Route path="dining" element={<Dining />}>
              <Route path="" element={<DiningList />} />
              <Route
                path="rejected-requests"
                element={<DiningList status="rejected" />}
              />
              <Route
                path="approved-requests"
                element={<DiningList status="approved" />}
              />
              <Route path="book-dining" element={<BookDining />} />
              <Route path="cart" element={<Cart />} />
              <Route path=":id" element={<DiningRecordPage />} />
            </Route>

            <Route path="reservation" element={<Reservation />}>
              <Route path="" element={<AdminRecordList />} />
              <Route
                path="rejected-requests"
                element={<AdminRecordList status="rejected" />}
              />
              <Route
                path="approved-requests"
                element={<AdminRecordList status="approved" />}
              />
              <Route path=":id" element={<AdminRecordPage />} />

              <Route path="users" element={<UserList />} />
              <Route path=":id/rooms" element={<RoomBooking />} />
            </Route>
          </Route>

          <Route path="user" element={<Auth allowedRoles={["USER"]} />}>
            <Route path="reservation" element={<Reservation />}>
              <Route path="" element={<RecordList />} />
              <Route
                path="approved-requests"
                element={<RecordList status="approved" />}
              />
              <Route
                path="rejected-requests"
                element={<RecordList status="rejected" />}
              />
              <Route path="reservation-form" element={<ReservationForm />} />
              <Route path=":id" element={<RecordPage />} />
            </Route>
            <Route path="dining" element={<Dining />}>
              <Route path="" element={<DiningList />} />
              <Route
                path="rejected-requests"
                element={<DiningList status="rejected" />}
              />
              <Route
                path="approved-requests"
                element={<DiningList status="approved" />}
              />
              <Route path="book-dining" element={<BookDining />} />
              <Route path="cart" element={<Cart />} />
              <Route path=":id" element={<DiningRecordPage />} />
            </Route>
          </Route>



          <Route
            path=":role"
            element={
              <Auth
                allowedRoles={[
                  "HOD",
                  "CHAIRMAN",
                  "DIRECTOR",
                  "DEAN",
                  "REGISTRAR",
                  "ASSOCIATE DEAN",
                ]}
              />
            }
          >
            <Route path="dining" element={<Dining />}>
              <Route path="" element={<DiningList />} />
              <Route path="book-dining" element={<BookDining />} />
              <Route path="cart" element={<Cart />} />
              <Route path=":id" element={<DiningRecordPage />} />
            </Route>

            <Route path="reservation" element={<Reservation />}>
              <Route path="" element={<AdminRecordList />} />
              <Route
                path="rejected-requests"
                element={<AdminRecordList status="rejected" />}
              />
              <Route
                path="approved-requests"
                element={<AdminRecordList status="approved" />}
              />
              <Route path=":id" element={<AdminRecordPage />} />

              <Route path="users" element={<UserList />} />
              <Route path=":id/rooms" element={<RoomBooking />} />
            </Route>
          </Route>

          <Route path="reservation" element={<Reservation />}>
            <Route path="" element={<RecordList />} />
            <Route path="reservation-form" element={<ReservationForm />} />
            <Route path=":id" element={<RecordPage />} />
          </Route>

          <Route path="dining" element={<Dining />}>
            <Route path="" element={<DiningList />} />
            <Route path="book-dining" element={<BookDining />} />
            <Route path="cart" element={<Cart />} />
            <Route path=":id" element={<DiningRecordPage />} />
          </Route>

          <Route path="test" element={<Reserve />} />

          <Route path="/iitropar-campus-map" element={<PDFViewer />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />

          <Route path="/unknown/*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
