import React from "react";
import { IoDocumentAttach } from "react-icons/io5";
import { GoFileDirectoryFill } from "react-icons/go";
import { TbBulbFilled } from "react-icons/tb";
import { GiConversation } from "react-icons/gi";
import { RiCalendarTodoFill } from "react-icons/ri";
import { LuMonitorCheck } from "react-icons/lu";
import { SlOrganization } from "react-icons/sl";
import { GrResources } from "react-icons/gr";
import { Link } from 'react-router-dom';

const QuickLinks = () => {
  const links = [
    { icon: <IoDocumentAttach className="mx-auto"/>, label: "Documents", disabled: true },
    { icon: <GoFileDirectoryFill className="mx-auto"/>, label: "Directory", url: '/employee/directory' },
    { icon: <TbBulbFilled className="mx-auto"/>, label: "Suggestions", disabled: true },
    { icon: <GiConversation className="mx-auto"/>, label: "FAQ Center", disabled: true },
    { icon: <RiCalendarTodoFill className="mx-auto"/>, label: "Appointments", badge: 5 },
    { icon: <LuMonitorCheck className="mx-auto"/>, label: "Job Portal", badge: 2 },
    { icon: <SlOrganization className="mx-auto"/>, label: "Org Chart", url: '/employee/orgChart' },
    { icon: <GrResources className="mx-auto"/>, label: "Resources", disabled: true },
  ];

  return (
    <div className="w-full relative md:mt-0 mt-4">
      <h5 className="text-xl font-normal leading-none mb-4 text-[#eb1c24] w-full">
        Quick Links
      </h5>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {links.map((link, index) => (
          <div

            key={index}
            className={`relative text-center rounded-lg p-4 shadow-lg transition-all duration-300 ease-in-out group 
              ${link.disabled 
                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                : "bg-white hover:bg-[#eb1c24] hover:text-white cursor-pointer"}`}
          >
            <Link to={link.url}>
            {/* Notification Badge */}
            {!link.disabled && link.badge && (
              <span className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-200 text-red-600 text-xs font-bold px-2 py-1 rounded-full">
                {link.badge}
              </span>
            )}

            <div
              className={`text-4xl mx-auto transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] 
                ${link.disabled 
                  ? "text-gray-400" 
                  : "text-red-600 group-hover:rotate-[-15deg] group-hover:scale-125 group-hover:text-white"}`}
            >
              {link.icon}
            </div>
            <p className="text-xs mt-2">{link.label}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickLinks;
