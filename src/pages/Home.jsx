import React from 'react'
import Header from '../components/Header'
import Announcement from '../components/Announcement'
import EmpOfMonths from '../components/EmpOfMonths'
import QuickLinks from '../components/QuickLinks'
import Documents from '../components/Documents'
import SpecialEvents from '../components/SpecialEvents'
import NewJoinees from '../components/NewJoinees'
import Promotions from '../components/Promotions'
import Footer from '../components/Footer'

const Home = () => {
    return (
        <div className=''>
            <Header />

            <div className='flex md:flex-row flex-col w-full px-6 gap-x-4 pt-6'>
                <div className='md:w-1/3 w-full'>
                    <Announcement />
                </div>

                <div className='md:w-1/3 w-full'>
                    <SpecialEvents />
                </div>

                <div className='flex flex-col md:w-1/3 w-full gap-y-4'>
                    <QuickLinks />
                    <NewJoinees />
                </div>

                {/* <div className="flex flex-col w-2/3 gap-y-4">
                    <div className='w-1/2 flex flex-row justify-between gap-x-4'>
                        <EmpOfMonths className='w-1/2' />
                        <QuickLinks className='w-1/2' />
                    </div>
                    <div className='w-1/2 flex flex-row justify-between gap-x-4'>
                        <SpecialEvents className='w-1/2' />
                        <Documents className='w-1/2' />
                    </div>
                </div> */}
            </div>

            {/* <div className='flex flex-row w-full px-6 gap-x-4 pb-6'>
                <div className='w-1/3'>
                    <NewJoinees />
                </div>

                <div className="flex flex-col w-2/3 gap-y-4">
                    <Promotions />
                </div>
            </div> */}


            <Footer />
            {/* <a href="#" class="text-center mx-[45%] text-xs font-normal text-gray-500 hover:underline py-4">
                SmartConnect Product
            </a> */}
        </div>
    )
}

export default Home
