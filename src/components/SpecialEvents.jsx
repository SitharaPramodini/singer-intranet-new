import React, { useState, useEffect, useRef } from 'react';
import { LiaBirthdayCakeSolid } from "react-icons/lia";
import { GrTrophy } from "react-icons/gr";
import { MdOutlineFestival } from "react-icons/md";
import EmpOfMonths from './EmpOfMonths';
import { IoPricetagsOutline } from "react-icons/io5";
import axios from "axios";

import {Globe} from 'lucide-react';


const SpecialEvents = () => {
    const [activeEvent, setActiveEvent] = useState(null);
    const [birthdayList, setBirthdayList] = useState([]);
    const [anniversaryList, setAnniversaryList] = useState([]);
    const [dayList, setDayList] = useState([]);
    const [festivalDayList, setFestivalDayList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userID, setUserID] = useState(null);

    // Load user session
    useEffect(() => {
        const sessionData = localStorage.getItem('userSession');
        if (sessionData) {
            const userSession = JSON.parse(sessionData);
            setUserID(userSession.userId);
        } else {
            console.log('No session data found');
        }
    }, []);

    const dropdownRefs = useRef({}); // store refs for each dropdown

    // Hardcoded lists for other events
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

    // Fetch today's birthdays and anniversaries from API
    useEffect(() => {
        const fetchEvents = async () => {
            setLoading(true);
            try {
                // Fetch birthdays
                const birthdayRes = await fetch('http://localhost:3000/api/employees/today-Bdays', {
                    credentials: 'include'
                });
                const birthdayData = await birthdayRes.json();
                if (birthdayRes.ok) setBirthdayList(birthdayData.birthdays || []);
                else setBirthdayList([]);

                // Fetch work anniversaries
                const anniversaryRes = await fetch('http://localhost:3000/api/employees/today-anniversary', {
                    credentials: 'include'
                });
                const anniversaryData = await anniversaryRes.json();
                if (anniversaryRes.ok) setAnniversaryList(anniversaryData.anniversaries || []);
                else setAnniversaryList([]);

                //fetch international days
                const daysRes = await fetch('http://localhost:3000/api/employees/international-days', {
                    credentials: 'include'
                });
                const dayData = await daysRes.json();
                if (daysRes.ok) setDayList(dayData.internationalDays || []);
                else setDayList([]);

                //fetch international days
                const festivalDaysRes = await fetch('http://localhost:3000/api/employees/festivals', {
                    credentials: 'include'
                });
                const festivalData = await festivalDaysRes.json();
                if (festivalDaysRes.ok) setFestivalDayList(festivalData.festivals || []);
                else setFestivalDayList([]);
            } catch (err) {
                console.error('Error fetching events:', err);
                setBirthdayList([]);
                setAnniversaryList([]);
                setDayList([]);
                setFestivalDayList([]);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            Object.values(dropdownRefs.current).forEach(ref => {
                if (ref && !ref.contains(event.target)) {
                    setActiveEvent(null);
                }
            });
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleEvent = async (event) => {
        setActiveEvent(activeEvent === event.id ? null : event.id);

        // Example payload (you can adjust according to your actual UI data)
        const payload = {
            category: "Special Events",
            sub_category: event.title,
            service_ID: 9,        // using id passed into toggleEvent
            emp_ID: userID,            // could come from logged-in user
            event: "User clicked event",
        };

        try {
            const res = await axios.post("http://localhost:3000/api/employees/create-eventLog", payload);
            console.log("Event log added:", res.data);
        } catch (err) {
            console.error("Failed to add event log:", err);
        }
    };

    const eventData = [
        { id: 1, icon: <LiaBirthdayCakeSolid className="icon text-3xl text-red-600" />, title: "Today Birthdays", count: birthdayList.length, list: birthdayList },
        { id: 2, icon: <GrTrophy className="icon text-2xl ml-2 text-red-600" />, title: "Work Anniversary", count: anniversaryList.length, list: anniversaryList },
        { id: 3, icon: <IoPricetagsOutline className="icon text-2xl ml-2 text-red-600" />, title: "International Days", count: dayList.length, list: dayList },
        { id: 4, icon: <MdOutlineFestival className="icon text-2xl ml-2 text-red-600" />, title: "Festival Greetings", count: festivalDayList.length, list: festivalDayList }
    ];

    // console.log(dayList)

    return (
        <div className="w-full gridwidth max-w-sm bg-transparent ">
            <h5 className="text-xl font-normal leading-none text-[#eb1c24] mb-4">Celebrations</h5>
            <EmpOfMonths />
            <ul className="space-y-3 relative mt-3">
                {eventData.map(event => (
                    <li key={event.id} className="relative" ref={el => dropdownRefs.current[event.id] = el}>
                        <button
                            onClick={() => toggleEvent(event)}
                            className="card flex items-center p-4 text-base font-semibold text-gray-900 rounded-lg bg-white hover:shadow-xl w-full"
                        >
                            {event.icon}
                            <span className="flex-1 ms-8 whitespace-nowrap text-left">{event.title}</span>
                            <span className="px-4 py-[4px] bg-red-100 hover:bg-red-600 hover:text-white rounded-full text-red-700 text-xs font-medium transition-colors duration-200">
                                {event.count}
                            </span>
                        </button>
                        <div
                            className={`absolute left-0 w-full mt-2 bg-white px-4 rounded-lg shadow-lg z-10 transition-all duration-300 ease-in-out overflow-hidden ${activeEvent === event.id ? "max-h-96 opacity-100 scale-100" : "max-h-0 opacity-0 scale-95"}`}
                            style={{
                                maxHeight: event.list.length > 3 ? '250px' : 'auto',
                                overflowY: event.list.length > 3 ? 'auto' : 'visible'
                            }}
                        >
                            <ul role="list" className="divide-y divide-gray-200">
                                {loading && (event.id === 1 || event.id === 2) ? (
                                    <li className="py-3">Loading...</li>
                                ) : event.list.length === 0 ? (
                                    <li className="py-3">No data available</li>
                                ) : (
                                    event.list.map((emp, index) => (
                                        <li key={index} className="py-4">
                                            <div className="flex items-center">
                                                <div className="shrink-0">
                                                    {emp.emp_image ? (
                                                        <img
                                                            src={emp.emp_image}
                                                            className="w-8 h-8 rounded-full"
                                                            alt="Profile"
                                                        />
                                                    ) : (
                                                        <Globe className="h-6 w-6 text-red-600" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0 ms-4">
                                                    <p className="text-sm font-medium text-gray-900 truncate">{emp.first_name} {emp.last_name}</p>
                                                    <p className="text-xs text-gray-500 truncate">
                                                        {event.title === "Festival Greetings"
                                                            ? emp.dep_name
                                                            : `${emp.dep_name} Department`}
                                                    </p>
                                                    {emp.joined_datetime && event.id === 2 && (
                                                        <p className="text-xs text-gray-500 truncate">Joined: {new Date(emp.joined_datetime).getFullYear()}</p>
                                                    )}
                                                </div>
                                                <button className="inline-flex items-center px-4 py-1 bg-red-100 hover:bg-red-600 hover:text-white rounded-full text-red-700 text-xs font-medium transition-colors duration-200">
                                                    {emp.branch_name || "Add a Wish"}
                                                </button>
                                            </div>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SpecialEvents;
