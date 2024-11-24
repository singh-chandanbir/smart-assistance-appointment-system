import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';

const slotDateForm = (slotDate) => {
  if (!slotDate) {
      return 'Date not available'; // Fallback if date is not provided
  }

  const date = new Date(slotDate); // Convert slotDate to a Date object

  if (isNaN(date)) {
      return 'Date not available'; // Fallback if the date is invalid
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};


const Dashboard = () => {
  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken]);

  

  return dashData && (
    <div className='m-5'>
      
      {/* Summary Cards */}
      <div className='flex flex-wrap gap-3'>
        
        {/* Doctors Card */}
        <div className='flex flex-wrap gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.doctor_icon} alt="Doctor Icon"></img>
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.doctors}</p>
            <p className='text-gray-400'>Doctors</p>
          </div>
        </div>

        {/* Appointments Card */}
        <div className='flex flex-wrap gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.appointments_icon} alt="Appointments Icon"></img>
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.appointments}</p>
            <p className='text-gray-400'>Appointments</p>
          </div>
        </div>

        {/* Patients Card */}
        <div className='flex flex-wrap gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.patients_icon} alt="Patients Icon"></img>
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.patients}</p>
            <p className='text-gray-400'>Patients</p>
          </div>
        </div>
      </div>

      {/* Latest Bookings Section */}
      <div className='bg-white'>
        <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border'>
          <img src={assets.list_icon} alt="List Icon"></img>
          <p className='font-semibold'>Latest Bookings</p>
        </div>

        <div className='overflow-x-auto pt-4'>
          <table className='min-w-full border-collapse'>
            <thead className='border-b bg-gray-100'>
              <tr>
                <th className='px-6 py-3 text-left text-gray-600'>User</th>
                <th className='px-6 py-3 text-left text-gray-600'>Appointment Date</th>
                <th className='px-6 py-3 text-left text-gray-600'>Symptom</th>
                <th className='px-6 py-3 text-left text-gray-600'>Severity</th>
                <th className='px-6 py-3 text-left text-gray-600'>Duration</th>
                <th className='px-6 py-3 text-left text-gray-600'>Status</th>
                <th className='px-6 py-3 text-left text-gray-600'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(dashData.latestAppointments) && dashData.latestAppointments.map((appointment, index) => (
                <tr key={index} className='hover:bg-gray-100'>
                  <td className='px-6 py-4'>
                    <img
                      className='inline-block rounded-full w-10'
                      src={appointment.userData?.image || 'defaultDoctorImage.jpg'}
                      alt="User"
                    />
                    <p className='text-gray-800 font-medium'>{appointment.userData?.name || 'Doctor'}</p>
                  </td>
                  <td className='px-6 py-4'>{appointment.date ? slotDateForm(appointment.date) : 'Date not available'}</td>
                  <td className='px-6 py-4'>{appointment.symptom || 'Not specified'}</td>
                  <td className='px-6 py-4'>{appointment.sverityOfSymptom || 'Not specified'}</td>
                  <td className='px-6 py-4'>{appointment.durationOfSymptom || 'Not specified'}</td>
                  <td className='px-6 py-4'>
                    {appointment.cancelled ? (
                      <p className='text-red-400 font-medium text-xs'>Cancelled</p>
                    ) : appointment.isCompleted ? (
                      <p className='text-green-500 font-medium text-xs'>Completed</p>
                    ) : (
                      <p className='text-yellow-500 font-medium text-xs'>Pending</p>
                    )}
                  </td>
                  <td className='px-6 py-4'>
                    {appointment.cancelled ? (
                      <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                    ) : appointment.isCompleted ? (
                      <p className='text-green-500 text-xs font-medium'>Completed</p>
                    ) : (
                      <img
                        onClick={() => cancelAppointment(appointment._id)}
                        className='w-10 cursor-pointer'
                        src={assets.cancel_icon}
                        alt="Cancel Appointment"
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

