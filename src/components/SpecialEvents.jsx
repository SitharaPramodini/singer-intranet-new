import React from 'react'
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { GrTrophy } from "react-icons/gr";
import { LuBaby } from "react-icons/lu";
import { MdOutlineFestival } from "react-icons/md";

const SpecialEvents = () => {
    return (


        <div class="w-full gridwidth max-w-sm bg-transparent pt-4">

            <h5 class="text-xl font-normal leading-none text-[#eb1c24] mb-6">Celebrations</h5>
            {/* <p>Commemorating Life's Special Moments</p> */}

            {/* <p class="text-sm font-normal text-gray-500 ">Connect with one of our available wallet providers or create a new one.</p> */}
            <ul class="space-y-3">
                <li>
                    <a href="#" class="flex items-center p-4 text-base font-semibold text-gray-900 rounded-lg bg-white hover:shadow-xl ">
                        <LiaBirthdayCakeSolid class="text-3xl text-red-600" />
                        <span class="flex-1 ms-8 whitespace-nowrap">Today Birthdays</span>
                        <button className="px-4 py-[4px] bg-red-100 hover:bg-red-600 hover:text-white rounded-full text-red-700 text-xs font-medium transition-colors duration-200">
                            6
                        </button>                    </a>
                </li>
                <li>
                    <a href="#" class="flex items-center p-4 text-base font-semibold text-gray-900 rounded-lg bg-white hover:shadow-xl ">
                        <GrTrophy class="text-2xl ml-2 text-red-600" />
                        <span class="flex-1 ms-8 whitespace-nowrap">Work Anniversary</span>
                        <button className="px-4 py-[4px] bg-red-100 hover:bg-red-600 hover:text-white rounded-full text-red-700 text-xs font-medium transition-colors duration-200">
                            20
                        </button>
                    </a>
                </li>
                <li>
                    <a href="#" class="flex items-center p-4 text-base font-semibold text-gray-900 rounded-lg bg-white hover:shadow-xl ">
                        <LuBaby class="text-2xl ml-2 text-red-600" />
                        <span class="flex-1 ms-8 whitespace-nowrap">New Born anniversary</span>
                        <button className="px-4 py-[4px] bg-red-100 hover:bg-red-600 hover:text-white rounded-full text-red-700 text-xs font-medium transition-colors duration-200">
                            4
                        </button>
                    </a>
                </li>
                <li>
                    <a href="#" class="flex items-center p-4 text-base font-semibold text-gray-900 rounded-lg bg-white hover:shadow-xl ">
                        <MdOutlineFestival class="text-2xl ml-2 text-red-600" />
                        <span class="flex-1 ms-8 whitespace-nowrap">Festival Greetings</span>
                        <button className="px-4 py-[4px] bg-red-100 hover:bg-red-600 hover:text-white rounded-full text-red-700 text-xs font-medium transition-colors duration-200">
                            2
                        </button>
                    </a>
                </li>
                
            </ul>
            {/* <div>
                <a href="#" class="inline-flex items-center text-xs font-normal text-gray-500 hover:underline ">
                    <svg class="w-3 h-3 me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7.529 7.988a2.502 2.502 0 0 1 5 .191A2.441 2.441 0 0 1 10 10.582V12m-.01 3.008H10M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    Why do I need to connect with my wallet?</a>
            </div> */}
        </div>

    )
}

export default SpecialEvents