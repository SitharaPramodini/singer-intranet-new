import React, { useState, useEffect, useRef } from 'react';
import { checkSession } from '../../utils/session';
import { Menu } from 'lucide-react';

const AdminHeader = () => {
    const [userRole, setUserRole] = useState(null);
    const [userID, setUserID] = useState(null);
    const [user, setUser] = useState({});
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Load user session
    useEffect(() => {
        const sessionData = localStorage.getItem('userSession');
        if (sessionData) {
            const userSession = JSON.parse(sessionData);
            setUserID(userSession.userId)
            setUserRole(userSession.role);
        } else {
            console.log('No session data found');
        }
    }, []);

    useEffect(() => {
        const verifySession = async () => {
            const isValid = await checkSession();

            if (!isValid) {
                alert('Session expired. Redirecting to login.');
                window.location.href = '/';
                return;
            }

            if (userRole === 'user') {
                alert('You do not have the privilege to access this page.');
                window.location.href = '/';
                return;
            }
        };

        verifySession();
    }, [userRole]); // run again once userRole is set

    // Fetch user details
    useEffect(() => {
        if (!userID) return;

        const fetchUserDetails = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/employees/userDetails/${userID}`);
                const data = await res.json();
                setUser(data.employee);
                console.log("data: ", data)
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

    return (
        <div>
            {/* Header */}
            <header className=" bg-white shadow-sm border-b border-gray-200">
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center space-x-4">
                        <Menu className="h-6 w-6 text-gray-600 lg:hidden" />
                        <a href='/admin-dashboard' className='flex flex-col'>
                            <img src='logo.png' className='h-14'/>
                        </a>

                    </div>
                    <div>
                        <div className='flex flex-col'>
                            <h1 className="text-2xl font-bold text-gray-400">Administrator Panel</h1>
                            {/* <p className="text-xs font-normal text-gray-700">Admin Panel</p> */}
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        

                        <div ref={dropdownRef} className="relative">
                            <button
                                type="button"
                                className="md:flex hidden items-center text-sm md:me-0"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsDropdownOpen(!isDropdownOpen);
                                }}
                            >
                                <div className="flex items-center space-x-2">
                                    <img className="w-10 h-10 rounded-lg" src={user.emp_image} alt="user photo" />
                                    <div className="flex flex-col items-start">
                                        <p className="px-4 text-md font-semibold text-gray-700">
                                            {user.first_name} {user.last_name}
                                        </p>
                                        <p className="px-4 text-xs font-normal text-gray-700">{user.emp_email}</p>
                                        <p className="px-4 text-xs font-normal text-gray-700">{userRole}</p>
                                    </div>
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
                    </div>
                </div>
            </header>
        </div>
    );

};

export default AdminHeader;
