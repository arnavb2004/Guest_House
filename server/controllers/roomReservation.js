import Reservation from "../models/reservationModel.js";
import archiver from 'archiver';
import { getFileById } from "../middlewares/fileStore.js";
export async function createReservation(req, res) {
  // console.log(req);
  try {
    //user details are contained in req.user

    const {
      numberOfGuests,
      numberOfRooms,
      roomType,
      purpose,
      guestName,
      arrivalDate,
      arrivalTime,
      address,
      category,
      departureTime,
      departureDate,
    } = req.body;
    console.log("Printing the user from make reservation route...")
    console.log(req.user)
    const email = req.user.email;
    console.log(req.files)
    //extract file
    const fileids = req.files.map((f) => f.id);
    console.log(req.body);
    await Reservation.create({
      guestEmail: email,
      guestName,
      address,
      purpose,
      arrivalTime,
      departureTime,
      numberOfGuests,
      numberOfRooms,
      roomType,
      arrivalDate,
      departureDate,
      category,
      address: address,
      files: fileids,
    });
    res.status(200).json({
      message:
        "Reservation Request added successfully. Please wait for approval from the admin.",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getAllReservationDetails(req, res) {
  try {
    if (req.user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ message: "You are not authorized to view this application" });
    }
    console.log("Getting all reservations...")
    const reservations = await Reservation.find();
    res.status(200).json( {reservations} );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getReservationDetails(req, res) {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (
      req.user.email != reservation.guestEmail &&
      req.user.role !== "ADMIN"
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to view this application" });
    }
    // const archive=archiver('zip');
    // res.setHeader('Content-Type', 'application/zip');
    // res.setHeader('Content-Disposition', 'attachment; filename=files.zip');
    res.json({reservation});
    // res.attachment('files.zip');
    // archive.pipe(res);
    // for(const fileId of reservation.files){
    //   const downloadStream=await getFileById(fileId);
    //   archive.append(downloadStream, {name:fileId});
    // }
    // archive.finalize();
    // res.on('finish',()=>{
    //   console.log("Download finished");
    // })
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function getReservationDocuments(req, res) {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (
      req.user.email != reservation.guestEmail &&
      req.user.role !== "ADMIN"
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to view this application" });
    }
    const archive=archiver('zip');
    // res.setHeader('Content-Type', 'application/zip');
    // res.setHeader('Content-Disposition', 'attachment; filename=files.zip');
    // res.json({reservation});
    res.attachment('files.zip');
    archive.pipe(res);
    for(const fileId of reservation.files){
      const downloadStream=await getFileById(fileId);
      archive.append(downloadStream, {name:fileId});
    }
    archive.finalize();
    res.on('finish',()=>{
      console.log("Download finished");
    })
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function approveReservation(req, res) {
  if (req.user.role !== "ADMIN") {
    return res
      .status(403)
      .json({ message: "You are not authorized to perform this action" });
  }
  try {
    const reservation = await Reservation.findById(req.params.id);
    reservation.status = "APPROVED";
    reservation.approvals.push(req.user._id);
    await reservation.save();
    res.status(200).json({ message: "Reservation Approved" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function rejectReservation(req, res) {
  if (req.user.role !== "ADMIN") {
    return res
      .status(403)
      .json({ message: "You are not authorized to perform this action" });
  }
  try {
    const reservation = await Reservation.findById(req.params.id);
    reservation.status = "REJECTED";
    reservation.approvals = reservation.approvals.filter(
      (res) => res !== req.user._id
    );
    await reservation.save();
    res.status(200).json({ message: "Reservation Rejected" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}
