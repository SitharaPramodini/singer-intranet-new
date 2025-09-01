import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, X, Calendar, Globe, FileText, AlertCircle, Image, Building, Users, Heart } from 'lucide-react';
import AdminHeader from '../admin-components/AdminHeader';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function FestivalAD() {
    // User session state
    const [userID, setUserID] = useState(null);
    const [userRole, setUserRole] = useState(null);

    // State for festival greetings data
    const [festivalGreetings, setFestivalGreetings] = useState([]);
    const [filteredGreetings, setFilteredGreetings] = useState([]);
    const [loading, setLoading] = useState(false);

    // Filter states
    const [filters, setFilters] = useState({
        title: '',
        branch: '',
        department: '',
        dateFrom: '',
        dateTo: ''
    });

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Form states
    const [formData, setFormData] = useState({
        festival_title: '',
        greeting: '',
        festival_image: ''
    });

    // Dropdown data
    const [branches, setBranches] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [filteredDepartments, setFilteredDepartments] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);

    // Load user session
    useEffect(() => {
        const sessionData = localStorage.getItem('userSession');
        if (sessionData) {
            const userSession = JSON.parse(sessionData);
            setUserID(userSession.userId);
            setUserRole(userSession.role);
        } else {
            console.log('No session data found');
            toast.error({ show: true, message: 'Please login to continue', type: 'error' });
        }
    }, []);

    // Fetch data on component mount
    useEffect(() => {
        if (userRole === 'admin') {
            fetchFestivalGreetings();
        }
    }, [userRole]);

    // API Functions
    const fetchFestivalGreetings = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/api/admin/festivals/', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            if (Array.isArray(data)) {
                setFestivalGreetings(data);
                setFilteredGreetings(data);
            } else {
                toast.error('Invalid response format', 'error');
            }
        } catch (error) {
            console.error('Error fetching festival greetings:', error);
            toast.error('Error fetching festival greetings', 'error');
        } finally {
            setLoading(false);
        }
    };

    const createFestivalGreeting = async (greetingData) => {
        try {
            const dataToSend = {
                ...greetingData,
                added_by: userID,
                added_datetime: new Date().toISOString()
            };

            const response = await fetch('http://localhost:3000/api/admin/festivals', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend)
            });
            const data = await response.json();
            console.log(data)
            if (data.message && data.festival_ID) {
                toast.success('Festival greeting created successfully!', 'success');
                fetchFestivalGreetings();
                return true;
            } else {
                toast.error(data.error || 'Failed to create festival greeting', 'error');
                return false;
            }
        } catch (error) {
            console.error('Error creating festival greeting:', error);
            toast.error('Error creating festival greeting', 'error');
            return false;
        }
    };

    const updateFestivalGreeting = async (id, greetingData) => {
        try {
            const response = await fetch(`http://localhost:3000/api/admin/festivals/${id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(greetingData)
            });
            const data = await response.json();
            if (data.message === 'Festival greeting updated') {
                toast.success('Festival greeting updated successfully!', 'success');
                fetchFestivalGreetings();
                return true;
            } else {
                toast.error(data.error || 'Failed to update festival greeting', 'error');
                return false;
            }
        } catch (error) {
            console.error('Error updating festival greeting:', error);
            toast.error('Error updating festival greeting', 'error');
            return false;
        }
    };

    const deleteFestivalGreeting = async (id) => {
        if (!window.confirm('Are you sure you want to delete this festival greeting?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/admin/festivals/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            const data = await response.json();
            if (data.message === 'Festival greeting deleted') {
                toast.success('Festival greeting deleted successfully!', 'success');
                fetchFestivalGreetings();
            } else {
                toast.error(data.error || 'Failed to delete festival greeting', 'error');
            }
        } catch (error) {
            console.error('Error deleting festival greeting:', error);
            toast.error('Error deleting festival greeting', 'error');
        }
    };

    // Apply filters
    useEffect(() => {
        let filtered = festivalGreetings;

        if (filters.title) {
            filtered = filtered.filter(greeting =>
                greeting.festival_title?.toLowerCase().includes(filters.title.toLowerCase())
            );
        }

        if (filters.dateFrom) {
            filtered = filtered.filter(greeting =>
                new Date(greeting.added_datetime) >= new Date(filters.dateFrom)
            );
        }

        if (filters.dateTo) {
            filtered = filtered.filter(greeting =>
                new Date(greeting.added_datetime) <= new Date(filters.dateTo)
            );
        }

        setFilteredGreetings(filtered);
    }, [filters, festivalGreetings]);

    // Handle form submission
    const handleSubmit = async () => {
        if (!formData.festival_title || !formData.greeting) {
            toast.warning('Please fill in all required fields', 'error');
            return;
        }

        const success = editingId
            ? await updateFestivalGreeting(editingId, formData)
            : await createFestivalGreeting(formData);

        if (success) {
            handleCloseModal();
        }
    };

    // Handle edit
    const handleEdit = async (greeting) => {
        setEditingId(greeting.festival_ID);

        try {
            const response = await fetch(`http://localhost:3000/api/admin/festivals/${greeting.festival_ID}`, {
                credentials: 'include'
            });
            const data = await response.json();

            if (data && !data.error) {
                setFormData({
                    festival_title: data.festival_title || '',
                    greeting: data.greeting || '',
                    festival_image: data.festival_image || '',
                });
                setShowModal(true);
            }
        } catch (error) {
            console.error('Error fetching greeting details:', error);
            toast.error('Error fetching greeting details', 'error');
        }
    };

    // Handle close modal
    const handleCloseModal = () => {
        setShowModal(false);
        setEditingId(null);
        setFormData({
            festival_title: '',
            greeting: '',
            festival_image: ''
        });
    };

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

            {/* Main Content */}
            <div className="p-6">
                <h1 className="text-4xl font-bold text-red-600 mb-6">Festivals</h1>

                {/* Filters and Actions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        {/* Filters */}
                        <div className="flex flex-wrap items-center space-x-4 space-y-2 lg:space-y-0">
                            <div className="flex items-center space-x-2">
                                <Search className="h-4 w-4 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search by festival title..."
                                    value={filters.title}
                                    onChange={(e) => setFilters(prev => ({ ...prev, title: e.target.value }))}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent w-48"
                                />
                            </div>

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
                        </div>

                        {/* Add Button */}
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add Festival Greeting</span>
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Loading festival greetings...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Festival Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Greeting</th>
                                        {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th> */}
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredGreetings.length > 0 ? (
                                        filteredGreetings.map((greeting) => (
                                            <tr key={greeting.festival_ID} className="hover:bg-gray-50">
                                                <td className="px-6 py-1 whitespace-nowrap">
                                                    <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                                                        {greeting.festival_image ? (
                                                            <img
                                                                src={greeting.festival_image}
                                                                alt={greeting.festival_title}
                                                                className="h-12 w-12 rounded-lg object-cover"
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                    e.target.nextSibling.style.display = 'flex';
                                                                }}
                                                            />
                                                        ) : null}
                                                        <Heart className="h-6 w-6 text-red-600" style={{ display: greeting.festival_image ? 'none' : 'block' }} />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-1 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{greeting.festival_title}</div>
                                                </td>
                                                <td className="px-6 py-1 text-sm text-gray-900 max-w-xs">
                                                    <div className="truncate" title={greeting.greeting}>
                                                        {greeting.greeting}
                                                    </div>
                                                </td>
                                                {/* <td className="px-6 py-1 whitespace-nowrap text-sm text-gray-900">
                          {getBranchName(greeting.branch_ID)}
                        </td>
                        <td className="px-6 py-1 whitespace-nowrap text-sm text-gray-900">
                          {getDepartmentName(greeting.dep_ID)}
                        </td>
                        <td className="px-6 py-1 whitespace-nowrap text-sm text-gray-900">
                          {getEmployeeName(greeting.emp_ID)}
                        </td> */}
                                                <td className="px-6 py-1 whitespace-nowrap text-sm text-gray-500">
                                                    {greeting.added_datetime ? new Date(greeting.added_datetime).toLocaleDateString() : 'N/A'}
                                                </td>
                                                <td className="px-6 py-1 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleEdit(greeting)}
                                                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                                            title="Edit"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteFestivalGreeting(greeting.festival_ID)}
                                                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                                                No festival greetings found
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
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-90vh overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {editingId ? 'Edit Festival Greeting' : 'Add New Festival Greeting'}
                            </h2>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Festival Title */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Festival Title <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Heart className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={formData.festival_title}
                                            onChange={(e) => setFormData(prev => ({ ...prev, festival_title: e.target.value }))}
                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            placeholder="e.g., Christmas Celebration 2024"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Festival Image URL */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Festival Image URL
                                    </label>
                                    <div className="relative">
                                        <Image className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <input
                                            type="url"
                                            value={formData.festival_image}
                                            onChange={(e) => setFormData(prev => ({ ...prev, festival_image: e.target.value }))}
                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            placeholder="https://example.com/festival-image.jpg"
                                        />
                                    </div>
                                </div>

                                {/* Greeting */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Greeting Message <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <textarea
                                            value={formData.greeting}
                                            onChange={(e) => setFormData(prev => ({ ...prev, greeting: e.target.value }))}
                                            rows="4"
                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                                <button
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    {editingId ? 'Update Day' : 'Create Day'}
                                </button>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}