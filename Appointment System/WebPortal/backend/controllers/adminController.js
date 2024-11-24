import validator from "validator"
import bcrypt from "bcrypt"
import { v2 as cloudinary } from "cloudinary"
import doctorModel from "../models/doctorModel.js"
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"
import userModel from "../models/userModel.js"
import { sendSMS } from "../utils/sendSMS.js"
// import Apppo

//API for adding doctor
const addDoctor = async (req,res) => {

    try{

        console.log("Request body:", req.body); // Debugging: log request body
        console.log("Uploaded file:", req.file);
      
      const {name, email, password, speciality, degree, experience, about, fees, address} = req.body
      const imageFile = req.file

      //checking for all data to add doctor
      if ( !name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
         return res.json({success:false,message:"Missing Details"})
      }

     if (!email) {
        return res.json({ success: false, message: "Email is required" });
      }

      //validating email format
      if (!validator.isEmail(email)){
        return res.json({success:false,message:"Please enter a valid Email"})
      }

      //validating strong password
      if( password.length <8){
        return res.json({success:false,message:"Please enter a strong Password"})
      }

      //hashing doctor password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      //upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: "image"})
      const imageUrl = imageUpload.secure_url

      const doctorData = {
        name,
        email,
        image: imageUrl,
        password: hashedPassword,
        speciality,
        degree,
        experience,
        about,
        fees,
        address: JSON.parse(address),
        date: Date.now()
      }

      const newDoctor = new doctorModel(doctorData)
      await newDoctor.save()

      res.json({success:true,message: "Doctor Added"})

    } catch(error){
        console.log(error)
        res.json({success:false, message:error.message})

    }
}


//API FOR ADMIN LOGIN

const loginAdmin= async (req,res) => {
  try {
    
    const {email, password} = req.body

    if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){

        const token = jwt.sign(email+password,process.env.JWT_SECRET)
        res.json({success:true,token})

    } else{
        res.json({success:false, message: "Invalid Credentials"})
    }

  } catch(error){
    console.log(error)
    res.json({success:false, message:error.message})
  }
}


//API to get all doctors list for admin panel
const allDoctors = async (req,res) => {
      try{

        const doctors = await doctorModel.find({}).select('-password')
        res.json({success:true,doctors})

      } catch(error){
        console.log(error)
    res.json({success:false, message:error.message})
      }
}

//API to get all appointments list
const appointmentsAdmin = async(req,res) => {

  try {

    const appointments = await appointmentModel.find({})
    res.json({success:true, appointments})

  } catch(error){
    console.log(error)
    res.json({success:false, message:error.message})
  }

}

//API for appointment cancellation
const appointmentCancel = async(req,res) => {
 
  try{

      const { appointmentId} = req.body

      const appointmentData = await appointmentModel.findById(appointmentId)

     

      await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled: true })
      const sms = `your appointment with the id ${appointmentId} cancellation `
      sendSMS(sms,appointmentData?.userData?.phone)

      //releasing doctor slot
      
      const {docId, slotDate, slotTime} = appointmentData

      const doctorData = await doctorModel.findById(docId)

      let slots_booked = doctorData.slots_booked

      slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

      await doctorModel.findByIdAndUpdate(docId, {slots_booked} )

      res.json({success:true, message: 'Appointment Cancelled' })

  } catch(error){

      console.log(error)
      res.json({success:false, message:error.message})

  }


}

//API to get dashboard data for admin panel
const adminDashboard = async(req,res) => {
  
  try{

    const doctors = await doctorModel.find({})
    const users = await userModel.find({})
    const appointments = await appointmentModel.find({})

    const dashData = {
       doctors: doctors.length,
       appointments: appointments.length,
       patients: users.length,
       latestAppointments: appointments.reverse().slice(0,5)
    }

    res.json({success:true, dashData})

  } catch(error){
    console.log(error)
    res.json({success:false, message:error.message})

  }


}

// API to edit an appointment
const editAppointment = async (req, res) => {
  const { date, time, patient, symptoms, appointmentId } = req.body;
  console.log(appointmentId)

  try {
    // Find appointment by ID and update it with the new data
    const appointment = await appointmentModel.findOneAndUpdate(
      {"_id":appointmentId},
      {
        slotDate : date,
        slotTime : time,
      },
   // Return the updated appointment
    );
    const sms = ` appointment details has been changed, updated details are: date - ${date} timeSlot-  ${time}`;
    sendSMS(sms, appointment?.userData?.phone)
    

    const new_app = appointmentModel.findOne({"id":appointmentId })
    console.log(new_app)

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export {editAppointment, addDoctor, loginAdmin,allDoctors, appointmentsAdmin, appointmentCancel, adminDashboard}