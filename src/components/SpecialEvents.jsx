import React, { useState } from 'react';
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { GrTrophy } from "react-icons/gr";
import { MdOutlineFestival } from "react-icons/md";
import EmpOfMonths from './EmpOfMonths';
import { IoPricetagsOutline } from "react-icons/io5";

const birthdayList = [
    { name: "Sithara Pramodini", department: "Marketing Department", branch: "Add a Wish" },
    { name: "Sewmini Sandeepa", department: "Finance Department", branch: "Add a Wish" },
    { name: "Pramod Ranaweera", department: "HR Department", branch: "Add a wish" }
];

const anniversaryList = [
    { name: "Sithara Pramodini", department: "Marketing Department", branch: "2 years" },
    { name: "Sewmini Sandeepa", department: "Finance Department", branch: "5 years" },
    { name: "Pramod Ranaweera", department: "HR Department", branch: "1 year" }
];

const newBornList = [
    { name: "Sithara Pramodini", department: "Marketing Department", branch: "Main branch" },
    { name: "John Doe", department: "Finance Department", branch: "Head Office" },
    { name: "Jane Smith", department: "HR Department", branch: "Regional Office" }
];

const festGreetingList = [
    { name: "Sithara Pramodini", department: "Wishing you joy and prosperity this festive season! May your celebrations be filled with happiness and success. ✨🎉", branch: "Reply" },
    { name: "Sewmini Sandeepa", department: "May this festival bring you happiness, peace, and success. Enjoy the celebrations! 🎊✨", branch: "Reply" },
    { name: "Pramod Ranaweera", department: "Wishing you a season of joy, laughter, and cherished moments. Happy festivities! 🎉🎶", branch: "Reply" }
];

const eventData = [
    { id: 1, icon: <LiaBirthdayCakeSolid className="icon text-3xl text-red-600" />, title: "Today Birthdays", count: 6, list: birthdayList },
    { id: 2, icon: <GrTrophy className="icon text-2xl ml-2 text-red-600" />, title: "Work Anniversary", count: 20, list: anniversaryList },
    { id: 3, icon: <IoPricetagsOutline className="icon text-2xl ml-2 text-red-600" />, title: "International Days", count: 4, list: newBornList },
    { id: 4, icon: <MdOutlineFestival className="icon text-2xl ml-2 text-red-600" />, title: "Festival Greetings", count: 2, list: festGreetingList }
];


const SpecialEvents = () => {
    const [activeEvent, setActiveEvent] = useState(null);

    const toggleEvent = (id) => {
        setActiveEvent(activeEvent === id ? null : id);
    };

    return (
        <div className="w-full gridwidth max-w-sm bg-transparent ">
            <h5 className="text-xl font-normal leading-none text-[#eb1c24] mb-4">Celebrations</h5>
            <EmpOfMonths />
            <ul className="space-y-3 relative mt-3">
                {eventData.map(event => (
                    <li key={event.id} className="relative">
                        <button 
                            onClick={() => toggleEvent(event.id)} 
                            className="card flex items-center p-4 text-base font-semibold text-gray-900 rounded-lg bg-white hover:shadow-xl w-full"
                        >
                            {event.icon}
                            <span className="flex-1 ms-8 whitespace-nowrap text-left">{event.title}</span>
                            <span className="px-4 py-[4px] bg-red-100 hover:bg-red-600 hover:text-white rounded-full text-red-700 text-xs font-medium transition-colors duration-200">
                                {event.count}
                            </span>
                        </button>
                        <div 
                            className={`absolute left-0 w-full mt-2 bg-white p-4 rounded-lg shadow-lg z-10 transition-all duration-300 ease-in-out overflow-hidden ${activeEvent === event.id ? "max-h-96 opacity-100 scale-100" : "max-h-0 opacity-0 scale-95"}`}
                        >
                            {/* <h5 className="text-lg font-semibold mb-2">Event Details</h5> */}
                            <ul role="list" className="divide-y divide-gray-200">
                                {event.list.map((emp, index) => (
                                    <li key={index} className="py-3 sm:py-4">
                                        <div className="flex items-center">
                                            <div className="shrink-0">
                                                <img src='emp.jpg' className="w-8 h-8 rounded-full" alt="Profile" />
                                            </div>
                                            <div className="flex-1 min-w-0 ms-4">
                                                <p className="text-sm font-medium text-gray-900 truncate">{emp.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{emp.department}</p>
                                            </div>
                                            <button className="inline-flex items-center px-4 py-1 bg-red-100 hover:bg-red-600 hover:text-white rounded-full text-red-700 text-xs font-medium transition-colors duration-200">
                                                {emp.branch}
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SpecialEvents;
