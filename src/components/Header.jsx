import React from 'react'

const Header = () => {
    return (
        <div className="relative w-full">
            <nav className="absolute top-0 left-0 w-full bg-transparent z-10 mt-2">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-3">
                    <a href="https://singer.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        {/* <img src="logo1.png" className="h-14" alt="singer Logo" /> */}
                    </a>
                    <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                        <button type="button" className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown" data-dropdown-placement="bottom">
                            <span className="sr-only">Open user menu</span>
                            <img className="w-8 h-8 rounded-full" src="emp.jpg" alt="user photo" />
                        </button>
                        <button data-collapse-toggle="navbar-user" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200">
                            <span className="sr-only">Open main menu</span>
                            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
                            </svg>
                        </button>
                    </div>
                    <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-user">
                        <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-transparent md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0">
                            <li><a href="#" className="block py-2 px-3 text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent hover:text-gray-200 md:p-0">Home</a></li>
                            <li><a href="#" className="block py-2 px-3 text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent hover:text-gray-200 md:p-0">Services</a></li>
                            {/* <li><a href="#" className="block py-2 px-3 text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent hover:text-gray-200 md:p-0">Pricing</a></li>
                            <li><a href="#" className="block py-2 px-3 text-white rounded-sm hover:bg-gray-100 md:hover:bg-transparent hover:text-gray-200 md:p-0">Contact</a></li> */}
                        </ul>
                    </div>
                </div>
            </nav>

            <img src="banner.png" className="w-full" alt="banner" />

            <button type="button" className="absolute ml-[3%] w-[16%] top-2 left-2 text-white rounded-full shadow-md hover:shadow-xl bg-[#eb1c24] hover:bg-[#551515] py-1 px-4 font-medium text-base transition-colors duration-200 z-10">
  Singer සත්කාර
</button>


            <button type="button" className="blinking-button absolute bottom-4 right-4 text-[#eb1c24] hover:text-white hover:bg-[#eb1c24] rounded-full bg-white py-1 px-6 font-medium text-lg transition-colors duration-200 z-10">
                Life at Singer
            </button>
        </div>
    )
}

export default Header
