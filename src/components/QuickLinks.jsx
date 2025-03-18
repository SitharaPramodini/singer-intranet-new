import React from "react";
import { IoDocumentAttach } from "react-icons/io5";
import { GoFileDirectoryFill } from "react-icons/go";
import { TbBulbFilled } from "react-icons/tb";
import { GiConversation } from "react-icons/gi";
import { RiCalendarTodoFill } from "react-icons/ri";
import { LuMonitorCheck } from "react-icons/lu";
import { SlOrganization } from "react-icons/sl";
import { GrResources } from "react-icons/gr";

const QuickLinks = () => {
  return (
    <div className="w-full relative ">
      {/* <button type="button" className="mb-4 text-white rounded-md bg-[#eb1c24] hover:bg-[#bf3232] w-full py-2 font-medium text-lg transition-colors duration-200 top-0 z-10 shadow-lg">
                Life at Singer
            </button> */}
      <h5 class="text-xl font-normal leading-none mb-4 text-[#eb1c24] w-full">
        Quick Links
      </h5>
      <div className="flex flex-col gap-y-4 ">
        <div className="flex flex-row gap-4 w-full">
          <div className="w-32 text-center bg-white shadow-lg rounded-lg p-4 hover:bg-[#eb1c24] hover:text-white transition-all duration-300 ease-in-out group">
            <IoDocumentAttach className="text-red-600 text-4xl mx-auto transition-transform duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)] group-hover:rotate-[-15deg] group-hover:scale-125 group-hover:text-white" />
            <p className="text-xs mt-2">Documents</p>
          </div>
          <div className="w-32 text-center bg-white shadow-lg rounded-lg p-4 hover:bg-[#eb1c24] hover:text-white transition-all duration-300 ease-in-out group">
            <GoFileDirectoryFill className="text-red-600 text-4xl mx-auto transition-transform duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)] group-hover:rotate-[-15deg] group-hover:scale-125 group-hover:text-white" />
            <p className="text-xs mt-2">Directory</p>
          </div>{" "}
          <div className="w-32 text-center bg-white shadow-lg rounded-lg p-4 hover:bg-[#eb1c24] hover:text-white transition-all duration-300 ease-in-out group">
            <TbBulbFilled className="text-red-600 text-4xl mx-auto transition-transform duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)] group-hover:rotate-[-15deg] group-hover:scale-125 group-hover:text-white" />
            <p className="text-xs mt-2">Suggetions</p>
          </div>
          <div className="w-32 text-center bg-white shadow-lg rounded-lg p-4 hover:bg-[#eb1c24] hover:text-white transition-all duration-300 ease-in-out group">
            <GiConversation className="text-red-600 text-4xl mx-auto transition-transform duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)] group-hover:rotate-[-15deg] group-hover:scale-125 group-hover:text-white" />
            <p className="text-xs mt-2">FAQ Center</p>
          </div>
        </div>
        <div className="flex flex-row gap-4 w-full">
          <div className="w-32 text-center bg-white shadow-lg rounded-lg p-4 hover:bg-[#eb1c24] hover:text-white transition-all duration-300 ease-in-out group">
            <RiCalendarTodoFill className="text-red-600 text-4xl mx-auto transition-transform duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)] group-hover:rotate-[-15deg] group-hover:scale-125 group-hover:text-white" />
            <p className="text-xs mt-2">Appointments</p>
          </div>
          <div className="w-32 text-center bg-white shadow-lg rounded-lg p-4 hover:bg-[#eb1c24] hover:text-white transition-all duration-300 ease-in-out group">
            <LuMonitorCheck className="text-red-600 text-4xl mx-auto transition-transform duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)] group-hover:rotate-[-15deg] group-hover:scale-125 group-hover:text-white" />
            <p className="text-xs mt-2">Job Portal</p>
          </div>
          <div className="w-32 text-center bg-white shadow-lg rounded-lg p-4 hover:bg-[#eb1c24] hover:text-white transition-all duration-300 ease-in-out group">
            <SlOrganization className="text-red-600 text-4xl mx-auto transition-transform duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)] group-hover:rotate-[-15deg] group-hover:scale-125 group-hover:text-white" />
            <p className="text-xs mt-2">Org Chart</p>
          </div>
          <div className="w-32 text-center bg-white shadow-lg rounded-lg p-4 hover:bg-[#eb1c24] hover:text-white transition-all duration-300 ease-in-out group">
            <GrResources className="text-red-600 text-4xl mx-auto transition-transform duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)] group-hover:rotate-[-15deg] group-hover:scale-125 group-hover:text-white" />
            <p className="text-xs mt-2">Resources</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickLinks;
