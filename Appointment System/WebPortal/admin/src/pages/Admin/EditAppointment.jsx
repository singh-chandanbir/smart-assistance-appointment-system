import React, { useContext, useState, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import { assets } from '../../assets/assets'

const EditAppointment = ({ appointmentId }) => {
    const { aToken, getAppointmentById, updateAppointment } = useContext(AdminContext)
    const { slotDateFormat, calculateAge } = useContext(AppContext)
    
    const [appointmentData, setAppointmentData] = useState(null)
    const [docImg, setDocImg] = useState(false)
    const [docName, setDocName] = useState('')
    const [slotDate, setSlotDate] = useState('')
    const [slotTime, setSlotTime] = useState('')

    useEffect(() => {
        if (appointmentId) {
            getAppointmentById(appointmentId).then(data => {
                setAppointmentData(data)
                setDocName(data.docData.name)
                setSlotDate(data.slotDate)
                setSlotTime(data.slotTime)
            })
        }
    }, [appointmentId])

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {
            if (!docName || !slotDate || !slotTime) {
                return toast.error('Please fill all fields')
            }

            const formData = new FormData()
            formData.append('appointmentId', appointmentId)
            formData.append('docName', docName)
            formData.append('slotDate', slotDate)
            formData.append('slotTime', slotTime)

            if (docImg) {
                formData.append('image', docImg)
            }

            // Send update request
            const { data } = await axios.post(`${backendUrl}/api/admin/update-appointment`, formData, {
                headers: { aToken }
            })

            if (data.success) {
                toast.success(data.message)
                // Optionally, redirect or reset form here
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error('Error updating appointment')
            console.error(error)
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className="m-5 w-full">
            <p className="mb-3 text-lg font-medium">Edit Appointment</p>

            <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
                {appointmentData ? (
                    <>
                        <div className="flex items-center gap-4 mb-8 text-gray-500">
                            <label htmlFor="doc-img">
                                <img
                                    className="w-16 bg-gray-100 rounded-full cursor-pointer"
                                    src={docImg ? URL.createObjectURL(docImg) : appointmentData.docData.image || assets.upload_area}
                                    alt="Doctor Image"
                                />
                            </label>
                            <input onChange={(e) => setDocImg(e.target.files[0])} type="file" id="doc-img" hidden />
                            <p>Upload Doctor<br /> Picture</p>
                        </div>

                        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
                            <div className="w-full lg:flex-1 flex flex-col gap-4">
                                <div className="flex-1 flex flex-col gap-1">
                                    <p>Doctor Name</p>
                                    <input
                                        onChange={(e) => setDocName(e.target.value)}
                                        value={docName}
                                        className="border rounded px-3 py-2"
                                        type="text"
                                        placeholder="Doctor Name"
                                        required
                                    />
                                </div>

                                <div className="flex-1 flex flex-col gap-1">
                                    <p>Appointment Date</p>
                                    <input
                                        onChange={(e) => setSlotDate(e.target.value)}
                                        value={slotDate}
                                        className="border rounded px-3 py-2"
                                        type="date"
                                        required
                                    />
                                </div>

                                <div className="flex-1 flex flex-col gap-1">
                                    <p>Appointment Time</p>
                                    <input
                                        onChange={(e) => setSlotTime(e.target.value)}
                                        value={slotTime}
                                        className="border rounded px-3 py-2"
                                        type="time"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-4">
                            <button type="submit" className="bg-primary px-10 py-3 mt-4 text-white rounded-full">
                                Update Appointment
                            </button>
                        </div>
                    </>
                ) : (
                    <p>Loading appointment data...</p>
                )}
            </div>
        </form>
    )
}

export default EditAppointment


