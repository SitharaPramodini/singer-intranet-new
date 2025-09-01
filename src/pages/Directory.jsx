import React, { useState, useEffect } from 'react';
import { Search, MapPin, Phone, Mail, Users, Warehouse } from 'lucide-react';

const Directory = () => {
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [userID, setUserID] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);

    // Get logged in user session
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
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserDetails();
    }, [userID]);

    // Fetch branch employees initially
    useEffect(() => {
        if (!user?.dep_ID) return;

        const fetchBranchEmployees = async () => {
            try {
                setLoading(true);
                const res = await fetch(`http://localhost:3000/api/employees/directory/${user.dep_ID}/${user.branch_ID}`);
                const data = await res.json();
                setEmployees(data);
                setFilteredEmployees(data);
            } catch (error) {
                console.error('Error fetching dep employees:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBranchEmployees();
    }, [user]);

    // Handle search
    useEffect(() => {
        const delaySearch = setTimeout(() => {
            if (searchTerm.trim() === '') {
                // If search is empty, show branch employees
                if (user?.branch_ID) {
                    fetchBranchEmployees();
                }
                return;
            }

            searchAllEmployees();
        }, 300);

        return () => clearTimeout(delaySearch);
    }, [searchTerm, user]);

    const fetchBranchEmployees = async () => {
        try {
            setSearchLoading(true);
            const res = await fetch(`http://localhost:3000/api/employees/directory/${user.branch_ID}`);
            const data = await res.json();
            setEmployees(data);
            setFilteredEmployees(data);
        } catch (error) {
            console.error('Error fetching branch employees:', error);
        } finally {
            setSearchLoading(false);
        }
    };

    const searchAllEmployees = async () => {
        try {
            setSearchLoading(true);
            const res = await fetch('http://localhost:3000/api/employees/directory');
            const data = await res.json();

            // Filter results based on search term
            const filtered = data.filter(employee =>
                employee.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employee.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employee.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employee.emp_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                employee.branch_name?.toLowerCase().includes(searchTerm.toLowerCase())
            );

            setEmployees(data);
            setFilteredEmployees(filtered);
        } catch (error) {
            console.error('Error searching employees:', error);
        } finally {
            setSearchLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading directory...</p>
                </div>
            </div>
        );
    }

    return (
        <div className=" bg-gray-50">

            {/* Header */}
            <div className="bg-transparent">
                <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex md:flex-row flex-col items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                                <Users className="mr-3 text-red-600" size={28} />
                                Employee Directory
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {searchTerm ? `Search results for "${searchTerm}"` : `Showing ${user?.branch_ID ? 'branch' : 'all'} employees`}
                            </p>
                        </div>
                        {/* Search Bar */}
                        <div className="md:ml-auto px-4 md:w-1/3 w-full sm:px-6 lg:px-8 py-6">
                            <div className="relative mx-auto">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search employees by name, position, or email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-10 pr-4 py-3 border border-red-200 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                                {searchLoading && (
                                    <div className="absolute right-3 top-3">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Employee Grid */}
            <div className="mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                {filteredEmployees.length === 0 && !searchLoading ? (
                    <div className="text-center py-12">
                        <Users className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-4 text-lg font-medium text-gray-900">No employees found</h3>
                        <p className="mt-2 text-gray-500">
                            {searchTerm ? 'Try adjusting your search terms.' : 'No employees available in your branch.'}
                        </p>
                    </div>
                ) : (

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {filteredEmployees.map((employee) => (
                            <a key={employee.emp_ID} href="#" class="directory-card education pt-10 bg-white rounded-xl hover:shadow-xl transition-shadow duration-200 shadow-md overflow-hidden">
                                <div className="flex relative w-32 h-32 justify-center">
                                    <div className="overlay absolute inset-0 z-0 mx-auto justify-center"></div>
                                    <img
                                        src={employee.emp_image ? `/${employee.emp_image}` : '/api/placeholder/64/64'}
                                        alt={`${employee.first_name} ${employee.last_name}`}
                                        className="w-32 h-32 mt-[-1.5rem] rounded-full object-cover border-2 border-red-600 relative z-10"
                                    />
                                </div>

                                <p className="bg-red-600 px-3 py-1 z-10 rounded-full text-white font-normal text-xs mt-[-2.5rem]">{employee.position}</p>

                                <div className="flex flex-col items-center">
                                    <h3 className="text-lg text-center font-semibold text-gray-900 w-[95%]">
                                        {employee.first_name} {employee.last_name}
                                    </h3>
                                </div>



                                <div className="px-6 pb-4 space-y-3 ml-[-5rem] mt-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <MapPin className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                                        <span>{employee.branch_name} Branch</span>
                                    </div>

                                    <div className="flex items-center text-sm text-gray-600">
                                        <Warehouse className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                                        <span>{employee.dep_name} Department</span>
                                    </div>

                                    <div className="flex items-center text-sm text-gray-600">
                                        <Mail className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                                        <span className="truncate">{employee.emp_email}</span>
                                    </div>

                                    {employee.extention && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Phone className="w-4 h-4 text-red-500 mr-2 flex-shrink-0" />
                                            <span className='font-semibold'>Ext: {employee.extention}</span>
                                        </div>
                                    )}
                                </div>

                            </a>
                        ))}
                    </div>

                )}
            </div>
        </div>
    );
};

export default Directory;