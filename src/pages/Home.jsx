import React, { useState, useEffect } from 'react';
import Announcement from '../components/Announcement'
import EmpOfMonths from '../components/EmpOfMonths'
import QuickLinks from '../components/QuickLinks'
import Documents from '../components/Documents'
import SpecialEvents from '../components/SpecialEvents'
import NewJoinees from '../components/NewJoinees'
import Promotions from '../components/Promotions'
import Footer from '../components/Footer'
import { checkSession } from '../../utils/session';

const Home = () => {

    useEffect(() => {
    const verifySession = async () => {
      const isValid = await checkSession();
      if (!isValid) {
        alert('Session expired. Redirecting to login.');
        window.location.href = '/';
      }
    };

    verifySession();
  }, []);

    return (
        <div className=''>

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
            </div>

        </div>
    )
}

export default Home
