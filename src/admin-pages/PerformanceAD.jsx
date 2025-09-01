import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, X, Calendar, Building, Users, FileText, AlertCircle } from 'lucide-react';
import AdminHeader from '../admin-components/AdminHeader';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from "react-select";

export default function PerformanceAD() {
    // User session state
    const [userID, setUserID] = useState(null);
    const [userRole, setUserRole] = useState(null);

    // State for performance data
    const [performances, setPerformances] = useState([]);
    const [deactivatedPerformances, setDeactivatedPerformances] = useState([]);
    const [filteredPerformances, setFilteredPerformances] = useState([]);
    const [loading, setLoading] = useState(false);

    // Filter states
    const [filters, setFilters] = useState({
        dateFrom: '',
        dateTo: '',
        title: '',
        branch: '',
        department: ''
    });

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Form states
    const [formData, setFormData] = useState({
        emp_ID: '',
        branch_ID: '',
        dep_ID: '',
        performance_title: '',
        description: '',
        datetime: new Date().toISOString().split('T')[0]
    });

    // Dropdown data
    const [branches, setBranches] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [filteredDepartments, setFilteredDepartments] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);

    // Alert state
    const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

    // Load user session
    useEffect(() => {
        const sessionData = localStorage.getItem('userSession');
        if (sessionData) {
            const userSession = JSON.parse(sessionData);
            setUserID(userSession.userId);
            setUserRole(userSession.role);
        } else {
            console.log('No session data found');
            setAlert({ show: true, message: 'Please login to continue', type: 'error' });
        }
    }, []);

    // Fetch performances on component mount
    useEffect(() => {
        if (userRole === 'admin') {
            fetchPerformances();
            fetchBranches();
            fetchDepartments();
            fetchEmployees();
        }
    }, [userRole]);

    // API Functions
    const fetchPerformances = async () => {
        try {
            setLoading(true);
            const res = await fetch('http://localhost:3000/api/admin/performance', { credentials: 'include' });
            const data = await res.json();

            if (data.success) {
                console.log(data);

                // Separate active vs deactive
                const activePerformances = data.performances.filter(p => p.status !== 'deactive');
                const deactivatedPerformances = data.performances.filter(p => p.status === 'deactive');

                // Set separately
                setPerformances(activePerformances);
                setFilteredPerformances(activePerformances);
                setDeactivatedPerformances(deactivatedPerformances);

            } else {
                toast.error('Failed to fetch performances', 'error');
            }
        } catch (err) {
            console.error(err);
            toast.error('Error fetching performances', 'error');
        } finally {
            setLoading(false);
        }
    };


    // Mock functions for branches, departments, employees (replace with actual APIs)
    // Fetch branches from API
    const fetchBranches = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/employees/all-branches', {
                credentials: 'include'
            });
            const data = await res.json();

            setBranches(data);

        } catch (error) {
            console.error('Error fetching branches:', error);
        }
    };

    // Fetch departments from API
    const fetchDepartments = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/employees/all-departments', {
                credentials: 'include'
            });
            const data = await res.json();
            setDepartments(data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    // Fetch employees from API
    const fetchEmployees = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/employees/all-employees', {
                credentials: 'include'
            });
            const data = await res.json();

            setEmployees(data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    // Filter departments based on selected branch
    // useEffect(() => {
    //     if (formData.branch_ID) {
    //         const filtered = departments.filter(
    //             dep => dep.branch_ID === parseInt(formData.branch_ID)
    //         );
    //         setFilteredDepartments(filtered);
    //         setFormData(prev => ({ ...prev, dep_ID: '', emp_ID: '' }));
    //     } else {
    //         setFilteredDepartments([]);
    //     }
    // }, [formData.branch_ID, departments]);

    // Filter employees based on selected branch and department
    // useEffect(() => {
    //     if (formData.branch_ID && formData.dep_ID) {
    //         // Case 1: filter by both branch and department
    //         const filtered = employees.filter(
    //             emp =>
    //                 emp.branch_ID === parseInt(formData.branch_ID) &&
    //                 emp.dep_ID === parseInt(formData.dep_ID)
    //         );
    //         setFilteredEmployees(filtered);
    //         setFormData(prev => ({ ...prev, emp_ID: '' }));
    //     } else if (formData.branch_ID) {
    //         // Case 2: filter only by branch
    //         const filtered = employees.filter(
    //             emp => emp.branch_ID === parseInt(formData.branch_ID)
    //         );
    //         setFilteredEmployees(filtered);
    //     } else if (formData.dep_ID) {
    //         // Case 3: filter only by department
    //         const filtered = employees.filter(
    //             emp => emp.dep_ID === parseInt(formData.dep_ID)
    //         );
    //         setFilteredEmployees(filtered);
    //     } else {
    //         // Case 4: nothing selected → show all employees
    //         setFilteredEmployees(employees);
    //     }
    // }, [formData.branch_ID, formData.dep_ID, employees]);



    const createPerformance = async (performanceData) => {
        console.log(performanceData)
        try {
            const response = await fetch('http://localhost:3000/api/admin/performance/', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(performanceData)
            });
            const data = await response.json();
            if (data.success) {
                toast.success('New performance added!', 'success');
                fetchPerformances();
                return true;
            } else {
                toast.error(data.message || 'Failed to add performance', 'error');
                return false;
            }
        } catch (error) {
            console.error('Error adding performance:', error);
            toast.error('Error adding performance', 'error');
            return false;
        }
    };

    const updatePerformance = async (id, performanceData) => {
        try {
            const response = await fetch(`http://localhost:3000/api/admin/performance/${id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(performanceData)
            });
            const data = await response.json();
            if (data.success) {
                toast.success('Performance updated!', 'success');
                fetchPerformances();
                return true;
            } else {
                toast.error(data.message || 'Failed to update performance', 'error');
                return false;
            }
        } catch (error) {
            console.error('Error updating performance:', error);
            toast.error('Error updating performance', 'error');
            return false;
        }
    };

    const deletePerformance = async (id) => {
        if (!window.confirm('Are you sure you want to delete this performance record?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/admin/performance/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            const data = await response.json();
            if (data.success) {
                toast.success('Performance deleted!', 'success');
                fetchPerformances();
            } else {
                toast.error(data.message || 'Failed to delete performance', 'error');
            }
        } catch (error) {
            console.error('Error deleting performance:', error);
            toast.error('Error deleting performance', 'error');
        }
    };

    // Filter departments based on selected branch
    // useEffect(() => {
    //     if (formData.branch_ID) {
    //         const filtered = departments.filter(dep => dep.branch_ID === parseInt(formData.branch_ID));
    //         setFilteredDepartments(filtered);
    //         setFormData(prev => ({ ...prev, dep_ID: '', emp_ID: '' }));
    //     } else {
    //         setFilteredDepartments([]);
    //     }
    // }, [formData.branch_ID, departments]);

    // Filter employees based on selected branch and department
    // useEffect(() => {
    //     if (formData.branch_ID && formData.dep_ID) {
    //         const filtered = employees.filter(emp =>
    //             emp.branch_ID === parseInt(formData.branch_ID) &&
    //             emp.dep_ID === parseInt(formData.dep_ID)
    //         );
    //         setFilteredEmployees(filtered);
    //         setFormData(prev => ({ ...prev, emp_ID: '' }));
    //     } else if (formData.branch_ID) {
    //         const filtered = employees.filter(emp => emp.branch_ID === parseInt(formData.branch_ID));
    //         setFilteredEmployees(filtered);
    //     } else {
    //         setFilteredEmployees([]);
    //     }
    // }, [formData.branch_ID, formData.dep_ID, employees]);

    // Apply filters
    useEffect(() => {
        let filtered = performances;

        if (filters.title) {
            filtered = filtered.filter(p =>
                p.performance_title.toLowerCase().includes(filters.title.toLowerCase())
            );
        }

        if (filters.branch) {
            filtered = filtered.filter(p => p.branch_name === filters.branch);
        }

        if (filters.department) {
            filtered = filtered.filter(p => p.dep_name === filters.department);
        }

        if (filters.status) {
            filtered = filtered.filter(p => p.status === deactivatedPerformances);
        }

        if (filters.dateFrom) {
            filtered = filtered.filter(p => new Date(p.datetime) >= new Date(filters.dateFrom));
        }

        if (filters.dateTo) {
            filtered = filtered.filter(p => new Date(p.datetime) <= new Date(filters.dateTo));
        }

        setFilteredPerformances(filtered);
    }, [filters, performances]);

    // Handle form submission
    // State for preview
    const [previewData, setPreviewData] = useState(null);
    const [confirmed, setConfirmed] = useState(false);

    // Form submit → show preview
    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.emp_ID || !formData.branch_ID || !formData.dep_ID || !formData.performance_title) {
            toast.warning('Please fill in all required fields', 'error');
            return;
        }

        // Prepare preview data
        const selectedEmployee = employees.find(emp => emp.emp_ID === parseInt(formData.emp_ID));
        const branch = branches.find(b => b.branch_ID === parseInt(formData.branch_ID))?.branch_name || "";
        const department = departments.find(d => d.dep_ID === parseInt(formData.dep_ID))?.dep_name || "";

        setPreviewData({
            id: formData.emp_ID,
            image: selectedEmployee?.emp_image || "/default.png",
            name: `${selectedEmployee?.first_name} ${selectedEmployee?.last_name}`,
            description: formData.description,
            branch: branch,
            department: department,
            title: formData.performance_title,
        });
    };

    // Confirm → actually save
    const handleConfirm = async () => {
        const success = editingId
            ? await updatePerformance(editingId, {
                performance_title: formData.performance_title,
                description: formData.description
            })
            : await createPerformance(formData);

        if (success) {
            setConfirmed(true);
            handleCloseModal();
        }
    };

    // Discard → back to form
    const handleDiscard = () => {
        setPreviewData(null);
    };


    // Handle edit
    const handleDeactivate = async (performance) => {
        try {
            const response = await fetch(`http://localhost:3000/api/admin/performance/deactivate/${performance.performance_ID}`, {
                method: 'PUT',
                credentials: 'include',
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Successfully deactivated!'); // Show success toast
                // Option 1: Refetch performances
                fetchPerformances();

            } else {
                toast.error(data.message || 'Failed to deactivate performance');
            }
        } catch (error) {
            console.error('Error deactivating performance:', error);
            toast.error('Error deactivating performance');
        }
    };


    // Handle close modal
    const handleCloseModal = () => {
        setShowModal(false);
        setEditingId(null);
        setFormData({
            emp_ID: '',
            branch_ID: '',
            dep_ID: '',
            performance_title: '',
            description: '',
            datetime: new Date().toISOString().split('T')[0]
        });
    };

    // Get unique values for filter dropdowns
    const uniqueBranches = [...new Set(performances.map(p => p.branch_name))];
    const uniqueDepartments = [...new Set(performances.map(p => p.dep_name))];

    if (userRole !== 'admin') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-800">Access Denied</h2>
                    <p className="text-gray-600">You need admin privileges to access this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />

            {/* Main Content */}
            <div className="p-6">
                {/* Filters and Actions */}
                <h1 className="text-4xl font-bold text-red-600 mb-6">Outstanding Performance</h1>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        {/* Filters */}
                        <div className="flex flex-wrap items-center space-x-4 space-y-2 lg:space-y-0">
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <input
                                    type="date"
                                    placeholder="From Date"
                                    value={filters.dateFrom}
                                    onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                                <span className="text-gray-500">to</span>
                                <input
                                    type="date"
                                    placeholder="To Date"
                                    value={filters.dateTo}
                                    onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <Search className="h-4 w-4 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search by title..."
                                    value={filters.title}
                                    onChange={(e) => setFilters(prev => ({ ...prev, title: e.target.value }))}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent w-48"
                                />
                            </div>

                            <select
                                value={filters.branch}
                                onChange={(e) => setFilters(prev => ({ ...prev, branch: e.target.value }))}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            >
                                <option value="">All Branches</option>
                                {uniqueBranches.map(branch => (
                                    <option key={branch} value={branch}>{branch}</option>
                                ))}
                            </select>

                            <select
                                value={filters.department}
                                onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            >
                                <option value="">All Departments</option>
                                {uniqueDepartments.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>

                            {/* <button
                                onClick={() => setFilters(prev => ({ ...prev, status: "deactivated" }))}
                                className="flex items-center space-x-2 text-red-600 bg-red-100 hover:bg-red-200 px-4 py-2 rounded-lg transition-colors"
                            >
                                <span>Deactivated</span>
                            </button> */}

                        </div>

                        {/* Add Button */}
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add Employee Performance</span>
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Loading performances...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredPerformances.length > 0 ? (
                                        filteredPerformances.map((performance) => (
                                            <tr key={performance.performance_ID} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        {performance.emp_image ? (
                                                            <img
                                                                src={performance.emp_image}
                                                                alt={`${performance.first_name} ${performance.last_name}`}
                                                                className="h-8 w-8 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                                                                <span className="text-red-600 text-sm font-medium">
                                                                    {performance.first_name?.[0]}
                                                                    {performance.last_name?.[0]}
                                                                </span>
                                                            </div>
                                                        )}

                                                        <div className="ml-3">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {performance.first_name} {performance.last_name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{performance.branch_name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{performance.dep_name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{performance.performance_title}</td>
                                                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{performance.description}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(performance.startDate).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {performance.endDate
                                                        ? new Date(performance.endDate).toLocaleDateString()
                                                        : "No end date"}
                                                </td>

                                                <td
                                                    className={`px-6 py-4 text-center text-sm max-w-xs truncate 
                                                                ${performance.status === "deactivated" ? "text-red-600" : "text-green-600"}`}
                                                >
                                                    {performance.status}
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        {performance.status !== "deactivated" && (
                                                            <button
                                                                onClick={() => handleDeactivate(performance)}
                                                                className="text-white bg-red-600 hover:text-red-900 p-1 rounded-full px-2 font-medium text-xs hover:bg-red-100"
                                                            >
                                                                Deactivate
                                                            </button>
                                                        )}
                                                        {/* <button
                                                            onClick={() => deletePerformance(performance.performance_ID)}
                                                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button> */}
                                                    </div>
                                                </td>

                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                                No performance records found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {previewData ? 'Preview Performance' : (editingId ? 'Edit Performance' : 'Add New Performance')}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            {!previewData ? (
                                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
                                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                            <h2 className="text-xl font-semibold text-gray-800">
                                                {editingId ? 'Edit Performance' : 'Add New Performance'}
                                            </h2>
                                            <button
                                                onClick={handleCloseModal}
                                                className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>

                                        <form onSubmit={handleSubmit} className="p-6">

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                                {/* Employee Selection */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Employee <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <Users className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                                                        <Select
                                                            className="pl-10"
                                                            options={employees.map(emp => ({
                                                                value: emp.emp_ID,
                                                                label: `${emp.first_name} ${emp.last_name} (EPF: ${emp.epf})`,
                                                                branch_ID: emp.branch_ID,
                                                                dep_ID: emp.dep_ID
                                                            }))}
                                                            value={employees
                                                                .filter(emp => emp.emp_ID === parseInt(formData.emp_ID))
                                                                .map(emp => ({
                                                                    value: emp.emp_ID,
                                                                    label: `${emp.first_name} ${emp.last_name} (EPF: ${emp.epf})`,
                                                                    branch_ID: emp.branch_ID,
                                                                    dep_ID: emp.dep_ID
                                                                }))[0] || null}
                                                            onChange={(selected) => {
                                                                if (selected) {
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        emp_ID: selected.value,
                                                                        branch_ID: selected.branch_ID,
                                                                        dep_ID: selected.dep_ID
                                                                    }));
                                                                } else {
                                                                    setFormData(prev => ({ ...prev, emp_ID: "", branch_ID: "", dep_ID: "" }));
                                                                }
                                                            }}
                                                            placeholder="Select or search employee..."
                                                            isClearable
                                                            isSearchable
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">EPF No</label>
                                                    <input
                                                        type="text"
                                                        value={
                                                            employees.find(b => b.emp_ID === parseInt(formData.emp_ID))?.EPF || ""
                                                        }
                                                        readOnly
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                                    />
                                                </div>

                                                {/* Branch (auto-filled) */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
                                                    <input
                                                        type="text"
                                                        value={
                                                            branches.find(b => b.branch_ID === parseInt(formData.branch_ID))?.branch_name || ""
                                                        }
                                                        readOnly
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                                    />
                                                </div>

                                                {/* Department (auto-filled) */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                                                    <input
                                                        type="text"
                                                        value={
                                                            departments.find(d => d.dep_ID === parseInt(formData.dep_ID))?.dep_name || ""
                                                        }
                                                        readOnly
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                                                    />
                                                </div>

                                                {/* Start Date */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Start Date <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={formData.startDate || ""}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                        required
                                                    />
                                                </div>

                                                {/* End Date */}
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        End Date <span className="pl-2 text-gray-400 font-thin">optional</span>
                                                    </label>
                                                    <input
                                                        type="date"
                                                        value={formData.endDate || ""}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                    // required
                                                    />
                                                </div>

                                                {/* Notice */}
                                                <div className="md:col-span-2">
                                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                                        <div className="flex items-start space-x-3">
                                                            <div>
                                                                <p className="text-sm text-blue-700">
                                                                    If an end date is not provided, the performance notice will remain visible for one week.                                                    </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Performance Title */}
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700">
                                                        Performance Title <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                        <input
                                                            type="text"
                                                            value={formData.performance_title}
                                                            onChange={(e) => setFormData(prev => ({ ...prev, performance_title: e.target.value }))}
                                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                            placeholder="e.g., Excellent Customer Service"
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                {/* Description */}
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Description
                                                    </label>
                                                    <textarea
                                                        value={formData.description}
                                                        onChange={(e) => setFormData(prev => ({
                                                            ...prev,
                                                            description: e.target.value.slice(0, 100) // ensure max 100 chars
                                                        }))}
                                                        rows="3"
                                                        maxLength={100} // optional, also restricts input in browser
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                                        placeholder="Describe the performance in detail..."
                                                    />
                                                    <p className="text-xs text-gray-400 mt-1">{formData.description.length}/100 characters</p>
                                                </div>

                                            </div>

                                            {/* Submit Buttons */}
                                            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                                                <button
                                                    type="button"
                                                    onClick={handleCloseModal}
                                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="px-4 py-2 bg-[#ed1c24] text-white rounded-lg hover:bg-red-700 transition-colors"
                                                >
                                                    {editingId ? 'Update Performance' : 'Add Employee Performance'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            ) : (
                                // ======= PREVIEW PAGE =======
                                <div className="min-w-full">
                                    <div className="flex bg-transparent rounded-lg overflow-hidden">
                                        <img
                                            src={previewData.image}
                                            alt={previewData.name}
                                            className="w-1/3 h-[8.9rem] object-cover"
                                        />
                                        <div className="py-3 pl-6 text-left w-2/3">
                                            <h3 className="text-base font-semibold">{previewData.name}</h3>
                                            <p className='py-1 pr-6 text-xs'>{previewData.description}</p>
                                            <p className="text-gray-600">
                                                <span className="text-sm font-medium">Branch: {previewData.branch}</span>
                                            </p>
                                            <div className="mb-1 mt-2">
                                                <span className="inline-block bg-red-100 text-red-700 py-[2px] px-5 rounded-full text-xs font-medium">
                                                    {previewData.description.includes("🎂") ? "Happy Birthday" : previewData.title}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex justify-end space-x-3 mt-4">
                                        <button
                                            onClick={handleDiscard} // discard and go back to form
                                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                        >
                                            Discard
                                        </button>
                                        <button
                                            onClick={handleConfirm} // confirm and call API
                                            className="px-4 py-2 bg-[#ed1c24] text-white rounded-lg hover:bg-red-700"
                                        >
                                            Confirm
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}


        </div>
    );
}