import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { useParams, useNavigate } from "react-router-dom";
import { TextField, FormControl } from "@mui/material";
import { useSelector } from "react-redux";
import { privateRequest } from "../utils/useFetch";
import "./Reservation_Form.css";
import { updateFilledPDF } from "../utils/generatePDF";
import InputFileUpload from "../components/uploadFile";
import { FileIcon, defaultStyles } from "react-file-icon";
import { Link} from "react-router-dom";
import ApplicantTable from "../components/ApplicantTable";
import NewWindow from "../components/NewWindow";

function EditReservationForm() {
    const user = useSelector((state) => state.user);
    const http = privateRequest(user.accessToken, user.refreshToken);
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const categoryInfo = {
      A: "Category A",
      B: "Category B",
      C: "Category C (For student's family only their parents are allowed)",
      D: "Category D (Guest and Department invited, etc.)",
    };

    const roomFareA = {
      "Single Occupancy": 0,
      "Double Occupancy": 0,
    };
    const roomFareB = {
      "Single Occupancy": 600,
      "Double Occupancy": 850,
    };
    const roomFareC = {
      "Single Occupancy": 900,
      "Double Occupancy": 1250,
    };
    const roomFareD = {
      "Single Occupancy": 1300,
      "Double Occupancy": 1800,
    };

    const roomFare = {
      A: roomFareA,
      B: roomFareB,
      C: roomFareC,
      D: roomFareD,
    };

    const [formData, setFormData] = useState({
        guestName: "",
        address: "",
        numberOfGuests: "",
        numberOfRooms: "",
        roomType: "Single Occupancy",
        arrivalDate: "",
        arrivalTime: "",
        departureDate: "",
        departureTime: "",
        purpose: "",
        category: "A",
        source: "GUEST",
        applicant: {
            name: "",
            designation: "",
            department: "",
            code: "",
            mobile: "",
            email: "",
        },
    });
    const formatDate = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset()); // Adjust for timezone
      return date.toISOString().split("T")[0]; // Keep only YYYY-MM-DD
    };
    
    const formatTime = (dateString) => {
      if (!dateString) return "";
      const date = new Date(dateString);
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset()); // Adjust for timezone
      return date.toISOString().split("T")[1].slice(0, 5); // Extract HH:MM
    };
    
    useEffect(() => {
        const fetchReservation = async () => {
            try {
                const response = await http.get(`/reservation/${id}`);
                const data = response.data.reservation;
                setFormData({
                    guestName: data.guestName || "",
                    address: data.address || "",
                    numberOfGuests: data.numberOfGuests || "",
                    numberOfRooms: data.numberOfRooms || "",
                    roomType: data.roomType || "Single Occupancy",
                    arrivalDate: formatDate(data.arrivalDate) || "",
                    arrivalTime: formatTime(data.arrivalDate) || "",
                    departureDate: formatDate(data.departureDate) || "",
                    departureTime: formatTime(data.departureDate) || "",
                    purpose: data.purpose || "",
                    category: data.category || "A",
                    source: data.source || "GUEST",
                    applicant: data.applicant || {},
                });
            } catch (error) {
                console.error("Error fetching reservation:", error);
            }
        };
        fetchReservation();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const toast_id = toast.loading("Updating reservation...");
        try {
            const res = await http.put(`/reservation/edit/${id}`, formData);
            if (res.status === 200) {
                toast.update(toast_id, {
                    render: "Reservation updated successfully!",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000,
                });
                navigate("..");
            } else {
                toast.update(toast_id, {
                    render: "Update failed. Try again.",
                    type: "error",
                    isLoading: false,
                    autoClose: 1000,
                });
            }
        } catch (error) {
            toast.update(toast_id, {
                render: "Error updating reservation.",
                type: "error",
                isLoading: false,
                autoClose: 1000,
            });
            console.error("Update failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="reservation-container border shadow-xl rounded-lg bg-white">
                <h2 className="py-2 mb-5">Edit Reservation</h2>
                <FormControl className="w-full flex gap-4">
                    <TextField label="Name of Guest" fullWidth name="guestName" value={formData.guestName} onChange={handleChange} />
                    <TextField label="Address" fullWidth name="address" value={formData.address} onChange={handleChange} />
                    <TextField label="Number of Guests" fullWidth name="numberOfGuests" value={formData.numberOfGuests} onChange={handleChange} />
                    <TextField label="Number of Rooms" fullWidth name="numberOfRooms" value={formData.numberOfRooms} onChange={handleChange} />
                    <TextField label="Arrival Date" fullWidth type="date" name="arrivalDate" value={formData.arrivalDate} onChange={handleChange} />
                    <TextField label="Arrival Time" fullWidth type="time" name="arrivalTime" value={formData.arrivalTime} onChange={handleChange} />
                    <TextField label="Departure Date" fullWidth type="date" name="departureDate" value={formData.departureDate} onChange={handleChange} />
                    <TextField label="Departure Time" fullWidth type="time" name="departureTime" value={formData.departureTime} onChange={handleChange} />
                    <TextField label="Purpose" fullWidth name="purpose" value={formData.purpose} onChange={handleChange} />
                    <div className="form-group">
              <label>Room Type*</label>

              <select
                name="roomType"
                className="w-full h-12 border rounded-md border-gray-300 p-2 whitespace-pre"
                onChange={handleChange}
                value={formData.roomType}
              >
                <option className="" value="Single Occupancy">
                  {formData.category !== "A" && (
                    <span>
                      Single Occupancy (Rs.
                      {roomFare[formData.category]["Single Occupancy"]}/- only)
                    </span>
                  )}
                  {formData.category === "A" && (
                    <span>Single Occupancy (Free)</span>
                  )}
                </option>
                <option className="" value="Double Occupancy">
                  {formData.category !== "A" && (
                    <span>
                      Double Occupancy (Rs.
                      {roomFare[formData.category]["Double Occupancy"]}/- only)
                    </span>
                  )}
                  {formData.category === "A" && (
                    <span>Double Occupancy (Free)</span>
                  )}
                </option>
              </select>
            </div>
            <div className="mt-5 flex flex-col gap-2">
                          <div>Applicant/Proposer Details:</div>
                          <div>
                            <ApplicantTable
                              entry={formData.applicant}
                              setEntry={(entry) =>
                                setFormData((prev) => ({ ...prev, applicant: entry }))
                              }
                            />
                          </div>
                        </div>
                    <button type="submit" onClick={handleSubmit} disabled={loading} className="submit-btn">
                        Update
                    </button>
                </FormControl>
            </div>
        </div>
    );
}

export default EditReservationForm;
