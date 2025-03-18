import React from 'react'
import { IoDocumentAttach } from "react-icons/io5";
import { FaDownload } from "react-icons/fa6";

const Documents = () => {
    return (

        <div class="w-full relative pt-4 px-6 bg-white border border-gray-200 rounded-lg shadow-sm gridwidth">
            <div class="flex items-center justify-between mb-4">
                <h5 class="text-xl font-normal leading-none text-[#eb1c24] ">Documents</h5>
                <a href="#" class="text-sm font-medium text-gray-500 hover:underline ">
                    View all
                </a>
            </div>
            <div class="flow-root">
                <ul role="list" class="divide-y divide-gray-200 ">
                    <li class="py-3 sm:py-4">
                        <div class="flex items-center transition-all duration-300 ease-in-out group">
                            <div class="shrink-0">
                                <IoDocumentAttach class="w-7 h-7 text-red-600 transition-transform duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)] group-hover:rotate-[-15deg] group-hover:scale-125" />
                            </div>
                            <div class="flex-1 min-w-0 ms-4">
                                <p class="text-sm font-medium text-gray-900 truncate ">
                                    Employee Handbook
                                </p>
                                <p class="text-xs text-gray-500 truncate ">
                                    Company policies and guidelines.
                                </p>
                            </div>
                            <button className="inline-flex items-center px-6 py-2 bg-red-100 hover:bg-red-600 hover:text-white rounded-full text-red-700 text-sm font-medium transition-colors duration-200">
                                <FaDownload />
                            </button>
                        </div>
                    </li>
                    <li class="py-3 sm:py-4">
                        <div class="flex items-center transition-all duration-300 ease-in-out group">
                            <div class="shrink-0">
                                <IoDocumentAttach class="w-7 h-7 text-red-600 transition-transform duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)] group-hover:rotate-[-15deg] group-hover:scale-125" />
                            </div>
                            <div class="flex-1 min-w-0 ms-4">
                                <p class="text-sm font-medium text-gray-900 truncate ">
                                Code of Conduct
                                </p>
                                <p class="text-xs text-gray-500 truncate ">
                                Standards for ethical behavior and workplace expectations.
                                </p>
                            </div>
                            <button className="inline-flex items-center px-6 py-2 bg-red-100 hover:bg-red-600 hover:text-white rounded-full text-red-700 text-sm font-medium transition-colors duration-200">
                                <FaDownload />
                            </button>
                        </div>
                    </li>
                    <li class="py-3 sm:py-4">
                        <div class="flex items-center transition-all duration-300 ease-in-out group">
                            <div class="shrink-0">
                                <IoDocumentAttach class="w-7 h-7 text-red-600 transition-transform duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)] group-hover:rotate-[-15deg] group-hover:scale-125" />
                            </div>
                            <div class="flex-1 min-w-0 ms-4">
                                <p class="text-sm font-medium text-gray-900 truncate ">
                                Travel Policy
                                </p>
                                <p class="text-xs text-gray-500 truncate ">
                                Rules for business travel and expense coverage.                                </p>
                            </div>
                            <button className="inline-flex items-center px-6 py-2 bg-red-100 hover:bg-red-600 hover:text-white rounded-full text-red-700 text-sm font-medium transition-colors duration-200">
                                <FaDownload />
                            </button>
                        </div>
                    </li>
                    <li class="py-3 sm:py-4">
                        <div class="flex items-center transition-all duration-300 ease-in-out group">
                            <div class="shrink-0">
                                <IoDocumentAttach class="w-7 h-7 text-red-600 transition-transform duration-300 ease-[cubic-bezier(0.4, 0, 0.2, 1)] group-hover:rotate-[-15deg] group-hover:scale-125" />
                            </div>
                            <div class="flex-1 min-w-0 ms-4">
                                <p class="text-sm font-medium text-gray-900 truncate ">
                                Expense Reimbursement Policy
                                </p>
                                <p class="text-xs text-gray-500 truncate ">
                                Rules for claiming work-related expenses.                                </p>
                            </div>
                            <button className="inline-flex items-center px-6 py-2 bg-red-100 hover:bg-red-600 hover:text-white rounded-full text-red-700 text-sm font-medium transition-colors duration-200">
                                <FaDownload />
                            </button>
                        </div>
                    </li>
                    
                </ul>
                
            </div>
        </div>

    )
}

export default Documents