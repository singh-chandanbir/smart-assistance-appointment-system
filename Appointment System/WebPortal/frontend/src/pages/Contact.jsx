import React from 'react'
import { assets } from '../assets/assets'

const contact = () => {
  return (
    <div>
     
     <div className='text-center text-2xl pt-10 text-gray-500'>
      <p>CONTACT <span className='text-gray-700 font-semibold'>US</span></p>
     </div>

     <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm'>

        <img className='w-full md:max-w-[360px]' src={assets.contact_image}></img>

        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-lg text-gray-600'>OUR OFFICE</p>
          <p className='text-gray-500'>Hosur Road / Marigowda Road, (Lakkasandra, Wilson Garden)<br></br> Bangalore – 560029 Karnataka, India.</p>
          <p className='text-gray-500'>Tel: 080 26995530<br></br> Email: dirstaff@nimhans.ac.in</p>
          <p className='font-semibold text-lg text-gray-600'>CAREERS AT NIMHANS</p>
          <p className='text-gray-500'>Learn more about us.</p>

          <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>Explore More</button>
        </div>

     </div>

    </div>
  )
}

export default contact