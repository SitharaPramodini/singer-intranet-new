import React, { useState, useEffect, useRef } from 'react';
import { IoIosHome } from "react-icons/io";
import { Link } from 'react-router-dom';

const Header = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [userID, setUserID] = useState(null);
    const [user, setUser] = useState({});
    const [banner, setBanner] = useState({});
    const dropdownRef = useRef(null);

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

    // Fetch user details
    useEffect(() => {
        if (!userID) return;

        const fetchUserDetails = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/employees/userDetails/${userID}`);
                const data = await res.json();
                setUser(data.employee);
                console.log(data.employee)
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserDetails();
    }, [userID]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const handleLogout = () => {
        // Clear session and redirect (example)
        localStorage.removeItem('userSession');
        window.location.href = '/';
    };

    useEffect(() => {

        const fetchBanner = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/employees/banner`);
                const data = await res.json();
                setBanner(data.banners[0].banner_img);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchBanner();
    }, []);

    return (
        <div className="relative w-full">
            {/* Navbar */}
            <nav className="absolute top-0 left-0 w-full bg-transparent z-10 mt-2">
                <div className="flex flex-wrap items-center justify-between mx-auto px-3">
                    <a href="https://singer.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        {/* Logo here if needed */}
                    </a>

                    <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">

                        <Link to='/dashboard'>
                            <IoIosHome className='text-4xl text-white mr-4' />
                        </Link>
                        {/* User Menu */}
                        <div ref={dropdownRef} className="relative">
                            <button
                                type="button"
                                className="md:flex hidden items-center text-sm md:me-0"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsDropdownOpen(!isDropdownOpen);
                                }}
                            >
                                <span className="sr-only">Open user menu</span>
                                <img className="w-8 h-8 rounded-lg" src={`/${user.emp_image}`} alt="user photo" />
                                <div className="flex flex-col items-start">
                                    <p className="px-4 text-md font-semibold text-white">
                                        {user.first_name} {user.last_name}
                                    </p>
                                    <p className="px-4 text-xs font-normal text-white">{user.emp_email}</p>
                                </div>
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg z-50">
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Mobile menu toggle */}
                        <button
                            id="menu-button"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            type="button"
                            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white font-bold rounded-lg md:hidden hover:bg-[#e747477e] focus:outline-none"
                        >
                            <span className="sr-only">Open main menu</span>
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                            </svg>
                        </button>
                    </div>

                    {/* Desktop menu */}
                    {/* <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
            <ul className="flex flex-col items-center p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-transparent md:space-x-8 md:flex-row md:mt-0 md:border-0">
              <li>
                <a href="#" className="block py-2 px-3 font-medium text-base text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent hover:text-gray-200 md:p-0">
                  Home
                </a>
              </li>
              <li className="relative group">
                <a href="#" className="block py-2 px-3 font-medium text-base text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent hover:text-gray-200 md:p-0">
                  Services
                </a>
                <ul className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg opacity-0 transform scale-95 transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:scale-100">
                  <li>
                    <a href="#" className="block px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-200 hover:rounded-lg">
                      Documents
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-200 hover:rounded-lg">
                      Directory
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-200 hover:rounded-lg">
                      Suggestions
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-200 hover:rounded-lg">
                      FAQ center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-200 hover:rounded-lg">
                      Appointments
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-200 hover:rounded-lg">
                      Job portal
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-200 hover:rounded-lg">
                      Org chart
                    </a>
                  </li>
                  <li>
                    <a href="#" className="block px-4 py-2 text-gray-700 hover:text-red-600 hover:bg-red-200 hover:rounded-lg">
                      Resources
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div> */}
                </div>
            </nav>

            {/* Sidebar */}
            <div
                className={`fixed z-10 top-0 left-0 h-full w-60 bg-white shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } transition-transform duration-300 ease-in-out`}
            >
                <ul className="p-6 space-y-4">
                    <li>
                        <img className="w-28 mx-auto" src="logo.png" alt="logo" />
                    </li>
                    <li>
                        <button
                            type="button"
                            className="flex mx-auto items-center text-sm bg-[#ecedef7a] shadow-lg rounded-full md:me-0 focus:ring-4 focus:ring-gray-300"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                            <p className="px-4 font-semibold">{user.first_name}</p>
                            <img className="w-8 h-8 rounded-full" src={user.emp_image} alt="user photo" />
                        </button>

                        {isDropdownOpen && (
                            <div className="mt-2 w-40 bg-white rounded shadow-lg z-50 mx-auto">
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </li>
                </ul>
            </div>

            {/* Banner */}
            <img src={`/${banner}`} className="w-full" alt="banner" />
        </div>
    );
};

export default Header;
