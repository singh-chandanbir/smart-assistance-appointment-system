import React from 'react'
import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 my-40 text-sm'>
             {/* {Left Side} */}
             <div>
                 <img className= 'mb-5 w-40' src={assets.logo2} />
                 <p className='w-full md:w-2/3 text-gray-600 leading-6'>NIMHANS is world-renowned as a centre for mental health, neurosciences and allied fields. The vision of NIMHANS is to be a world leader in these areas and to evolve state of the art approaches to patient care through translational research. </p>
             </div>
             {/* {Center Side} */}
             <div>
                <p className='text-xl font-medium mb-5'>COMPANY</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>Home</li>
                    <li>About Us</li>
                    <li>Contact Us</li>
                    <li>Privacy policy</li>
                </ul>
             </div>
             {/* {Right Side} */}
             <div>
             <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>080 26995530</li>
                    <li>ms@nimhans.ac.in</li>
                </ul>
             </div>
        </div>
        {/* {End} */}
        <div>
            <hr />
            <p className='py-5 text-sm text-center'>Copyright 2024 @ - All Right Reserved.</p>
        </div>
    </div>
  )
}

export default Footer