import React, { useState, useEffect } from 'react';
import { checkSession } from '../../utils/session';
import { Split, Calendar, Dessert, Megaphone, Users, Award, History, Blocks, Settings } from 'lucide-react';
import AdminHeader from '../admin-components/AdminHeader';
import { IoDocumentAttach } from "react-icons/io5";
import { GoFileDirectoryFill } from "react-icons/go";
import { TbBulbFilled } from "react-icons/tb";
import { GiConversation } from "react-icons/gi";
import { RiCalendarTodoFill } from "react-icons/ri";
import { LuMonitorCheck } from "react-icons/lu";
import { SlOrganization } from "react-icons/sl";
import { GrResources } from "react-icons/gr";
const AdminDashboard = () => {
    const [userRole, setUserRole] = useState(null);

    // Load user session
    useEffect(() => {
        const sessionData = localStorage.getItem('userSession');
        if (sessionData) {
            const userSession = JSON.parse(sessionData);
            console.log(userSession.role)
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



      const [selectedItem, setSelectedItem] = useState('dashboard');

  const sidebarItems = [
    { id: 'Announcements', icon: Megaphone, label: 'Announcements', count: null, url: 'admin-announcements' },
    { id: 'Employees', icon: Users, label: 'Employees', count: null },
    { id: 'Outstanding Performance', icon: Award, label: 'Outstanding Performance', count: null, url:'admin-performance' },
    { id: 'Users Event Logs', icon: History, label: 'Users Event Logs', count: null },
    { id: 'International Days', icon: Calendar, label: 'International Days', count: null, url: 'admin-internationalDays' },
    { id: 'Festivals', icon: Dessert, label: 'Festivals', count: null, url: 'admin-Festivals' },
    { id: 'Settings', icon: Settings, label: 'Settings', count: null },
  ];

  const cards = [
      { icon: <IoDocumentAttach className="mx-auto text-red-600"/>,  value: 'Documents', sub: 'Manage company documents and records' },
      { icon: <TbBulbFilled className="mx-auto text-red-600"/>, value: 'Suggestions', sub: 'Review and act on staff feedback' },
      { icon: <GiConversation className="mx-auto text-red-600"/>, value: 'FAQ Center', sub: 'Maintain and update FAQs for employees' },
      { icon: <RiCalendarTodoFill className="mx-auto text-red-600"/>, value: 'Appointments', sub: 'Organize meetings and schedules'  },
      { icon: <LuMonitorCheck className="mx-auto text-red-600"/>, value: 'Job Portal', sub: 'Post and manage internal job openings'},
      { icon: <GrResources className="mx-auto text-red-600"/>, value: 'Resources', sub: 'Provide tools and reference materials' },
    ];

    return (
        <div className="h-screen bg-gray-50">

            {/* Main Content */}
            <div className="flex flex-col md:flex-row">
                {/* Left Sidebar - 1/3 width */}
                <aside className="w-full md:w-1/3 bg-gray-50 ">
                    <div className="px-10 pt-6">
                        <nav className="space-y-3">
                            {sidebarItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <>
                                    <a
                                    href={item.url}
                                        className={`w-full flex items-center justify-between px-4 py-4 rounded-lg text-left transition-colors hover:bg-red-100 bg-white shadow-md`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Icon className="h-5 w-5" />
                                            <span className="font-medium">{item.label}</span>
                                        </div>
                                        {item.count && (
                                            <span className={`text-sm px-2 py-1 rounded-full ${selectedItem === item.id
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                {item.count}
                                            </span>
                                        )}
                                    </a>
                                    </>
                                );
                            })}
                        </nav>
                    </div>
                </aside>

                {/* Right Content Area - 2/3 width */}
<main className="w-full md:w-2/3 px-4 md:px-8 pt-4 overflow-auto">
  <div className="mb-6">
    <h2 className="text-2xl font-bold text-gray-800 mb-2">Main Services</h2>
  </div>

  {/* Responsive Cards Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
    {cards.slice(0, 8).map((card, index) => (
      <div
        key={index}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
      >
        <div className="inline-flex items-center justify-center text-5xl rounded-lg mb-4">
          {card.icon}
        </div>
        <p className="text-xl font-bold text-gray-900 mb-2">{card.value}</p>
        <p className="text-xs font-normal text-gray-500">{card.sub}</p>
      </div>
    ))}
  </div>
</main>

            </div>
        </div>
    );

};

export default AdminDashboard;
