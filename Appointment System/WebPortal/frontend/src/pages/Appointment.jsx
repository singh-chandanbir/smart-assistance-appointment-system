import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'
import { toast } from 'react-toastify'
import axios from 'axios'

const Appointment = () => {

  const { docId } = useParams()
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext)
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  const navigate = useNavigate()

  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')
  const [isFormVisible, setFormVisible] = useState(false)

  // New state for additional details
  const [symptom, setSymptom] = useState('')
  const [durationOfSymptom, setDurationOfSymptom] = useState('')
  const [healthInsurance, setHealthInsurance] = useState('')

  const fetchDocInfo = async () => {
    const docInfo = doctors.find(doc => doc._id === docId)
    setDocInfo(docInfo)


  }

  const getAvailableSlots = async () => {
    setDocSlots([])

    if (!docInfo || !docInfo.slots_booked) {
      // If docInfo or docInfo.slots_booked is not yet available, stop the function
      return;
    }

    //getting current date
    let today = new Date()

    for (let i = 0; i < 7; i++) {
      // getting date with index

      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      // setting end date with index

      let endTime = new Date()
      endTime.setDate(today.getDate() + i)
      endTime.setHours(21, 0, 0, 0)

      //setting hours
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      } else {
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }

      let timeSlots = []

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

        let day = currentDate.getDate()
        let month = currentDate.getMonth() + 1
        let year = currentDate.getFullYear()

        const slotDate = day + "_" + month + "_" + year
        const slotTime = formattedTime

        const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true

        if (isSlotAvailable) {
          timeSlots.push({
            dateTime: new Date(currentDate),
            time: formattedTime
          })
        }

        // add slot to array



        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }

      setDocSlots(prev => ([...prev, timeSlots]))

    }
  }

  const bookAppointment = async () => {

    if (!token) {

      toast.warn('Login to Book Appointment')
      return navigate('/login')

    }

    try {

      const date = docSlots[slotIndex][0].dateTime

      let day = date.getDate()
      let month = date.getMonth() + 1
      let year = date.getFullYear()

      const slotDate = day + "_" + month + "_" + year

      const { data } = await axios.post(backendUrl + '/api/user/book-appointment', { docId, slotDate, slotTime, symptom, durationOfSymptom, healthInsurance }, { headers: { token } })

      if (data.success) {

        toast.success(data.message)
        getDoctorsData()
        navigate('/my-appointments')

      } else {

        toast.error(data.message)

      }

    } catch (error) {

      console.log(error)
      toast.error(error.message)

    }


  }




  useEffect(() => {
    fetchDocInfo()
  }, [doctors, docId])

  useEffect(() => {
    getAvailableSlots()
  }, [docInfo])

  useEffect(() => {
    console.log(docSlots)
  }, [docSlots])

  return docInfo && (
    <div>
      {/* {Doctor detail} */}
      <div className='flex flex-col sm:flex-row gap-4'>
        <div>
          <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} />
        </div>

        <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0'>
          {/* {Doc Info} */}
          <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>{docInfo.name} <img className='w-5' src={assets.verified_icon} /></p>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>
              {docInfo.degree} - {docInfo.speciality}
            </p>
            <button className='py-0.5 px-2 border text-xs rounded-full'>{docInfo.experience}</button>
          </div>

          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>About <img src={assets.info_icon} /></p>
            <p className='text-sm text-gray-500 max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>
          <p className='text-gray-500 font-medium mt-4'>
            Appointment fee: <span className='text-gray-600'>{currencySymbol} {docInfo.fees}</span>
          </p>
        </div>
      </div>

      {/* {Booking Slots} */}
      <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700'>
        <p>Booking Slots</p>
        <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {
            docSlots.length && docSlots.map((item, index) => (
              <div onClick={() => setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`} key={index}>
                <p>{item[0] && daysOfWeek[item[0].dateTime.getDay()]}</p>
                <p>{item[0] && item[0].dateTime.getDate()}</p>
              </div>
            ))
          }
        </div>
        <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
          {docSlots.length && docSlots[slotIndex].map((item, index) => (
            <p onClick={() => setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`} key={index}>
              {item.time.toLowerCase()}
            </p>
          ))}
        </div>
        <button onClick={() => setFormVisible(true)} className='bg-primary text-white text-sm-font-light px-14 py-3 rounded-full my-6'>Book an Appointment</button>
        {isFormVisible && (
          <div  className="popup-form fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 w-11/12 max-w-md shadow-lg rounded-lg z-50 flex flex-col items-center space-y-4">
          <p className=''> - - PLEASE ENTER SOME MORE DETAILS  - -</p>
            <input
              type="text"
              placeholder="Symptoms"
              className="w-full p-3 border border-gray-300 rounded-md text-lg focus:outline-none focus:border-blue-500"
              value={symptom}
              onChange={(e) => setSymptom(e.target.value)}
            />
            <input
              type="text"
              placeholder="Duration of Symptoms"
              className="w-full p-3 border border-gray-300 rounded-md text-lg focus:outline-none focus:border-blue-500"
              value={durationOfSymptom}
              onChange={(e) => setDurationOfSymptom(e.target.value)}
            />
            <input
              type="text"
              placeholder="Any Health Insurance? (Yes/No)"
              className="w-full p-3 border border-gray-300 rounded-md text-lg focus:outline-none focus:border-blue-500"
              value={healthInsurance}
              onChange={(e) => setHealthInsurance(e.target.value)}
            />
            <button className='bg-primary text-white text-sm-font-light px-14 py-3 rounded-full my-6' onClick={bookAppointment}>Confirm Appointment</button>
            <button className='bg-primary text-white text-sm-font-light px-14 py-3 rounded-full my-6' onClick={() => setFormVisible(false)}>Cancel</button>
          </div>
        )}
      </div>

      {/* {Listed related doctors} */}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />

    </div>
  )
}

export default Appointment