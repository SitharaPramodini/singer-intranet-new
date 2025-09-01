import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, X, Calendar, Tag, User, Image, AlertCircle, Heart } from 'lucide-react';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminHeader from '../admin-components/AdminHeader';

const AnnouncementManagement = () => {
    const [announcements, setAnnouncements] = useState([]);

    const [services, setServices] = useState([]);

    const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [showOverlay, setShowOverlay] = useState(false);

    const [userRole, setUserRole] = useState(null);
    const [userID, setUserID] = useState(null);


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


    // Filter states
    const [filters, setFilters] = useState({
        dateFrom: '',
        dateTo: '',
        title: '',
        type: '',
        status: ''
    });

    const [formData, setFormData] = useState({
        announcement_type: '',
        announcement_title: '',
        announcement_description: '',
        announcement_img: '',
        updated_by: userID,
        start_datetime: '',
        end_datetime: '',
        service_ID: ''
    });

    // Fetch announcements on component mount (default to active)
    useEffect(() => {
        fetchActiveAnnouncements();
    }, []);

    // API Functions - Default load active announcements
    const fetchActiveAnnouncements = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/api/admin/announcements/active', {
                credentials: 'include'
            });
            const data = await response.json();
            console.log(data)

            if (Array.isArray(data)) {
                setAnnouncements(data);
                setFilters(prev => ({ ...prev, status: 'active' })); // Set filter to active
            } else {
                console.error('Expected array but got:', data);
                setAnnouncements([]);
            }
        } catch (error) {
            console.error('Error fetching active announcements:', error);
            toast.error('Error fetching active announcements');
            setAnnouncements([]);
        } finally {
            setLoading(false);
        }
    };

    // Helper function to refresh based on current filter
    const refreshBasedOnCurrentFilter = () => {
        switch (filters.status) {
            case 'active':
                fetchActiveAnnouncements();
                break;
            case 'upcoming':
                fetchUpcomingAnnouncements();
                break;
            case 'expired':
                fetchOldAnnouncements();
                break;
            default:
                fetchAllAnnouncements();
                break;
        }
    };

    const fetchAllAnnouncements = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/api/admin/announcements', {
                credentials: 'include'
            });
            const data = await response.json();

            if (Array.isArray(data)) {
                setAnnouncements(data);
            } else {
                console.error('Expected array but got:', data);
                setAnnouncements([]);
            }
        } catch (error) {
            console.error('Error fetching all announcements:', error);
            toast.error('Error fetching announcements');
            setAnnouncements([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchUpcomingAnnouncements = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/api/admin/announcements/upcoming', {
                credentials: 'include'
            });
            const data = await response.json();
            console.log(data)

            if (Array.isArray(data)) {
                setAnnouncements(data);
            } else {
                console.error('Expected array but got:', data);
                setAnnouncements([]);
            }
        } catch (error) {
            console.error('Error fetching upcoming announcements:', error);
            toast.error('Error fetching upcoming announcements');
            setAnnouncements([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchOldAnnouncements = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/api/admin/announcements/old', {
                credentials: 'include'
            });
            const data = await response.json();

            if (Array.isArray(data)) {
                setAnnouncements(data);
            } else {
                console.error('Expected array but got:', data);
                setAnnouncements([]);
            }
        } catch (error) {
            console.error('Error fetching old announcements:', error);
            toast.error('Error fetching old announcements');
            setAnnouncements([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchServices = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/api/admin/services', {
                credentials: 'include'
            });
            const data = await response.json();

            if (Array.isArray(data)) {
                setServices(data);
            } else {
                console.error('Expected array but got:', data);
                setServices([]);
            }
        } catch (error) {
            console.error('Error fetching services:', error);
            toast.error('Error fetching services');
            setServices([]);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchServices();
    }, []);

    const handleSubmit = async () => {
        if (!formData.announcement_type || !formData.announcement_title || !formData.announcement_description) {
            toast.warning('Please fill in all required fields');
            return;
        }

        setLoading(true);

        try {
            if (editingId) {
                // Update announcement
                const response = await fetch(`http://localhost:3000/api/admin/announcements/${editingId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (response.ok) {
                    toast.success('Announcement updated successfully!');
                    // Refresh based on current filter status
                    refreshBasedOnCurrentFilter();
                } else {
                    toast.error(result.error || 'Failed to update announcement');
                }
            } else {
                // Add new announcement
                console.log(formData)
                const response = await fetch('http://localhost:3000/api/admin/announcements', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify(formData)
                });

                const result = await response.json();
                console.log(result)

                if (response.ok) {
                    toast.success('Announcement added successfully!');
                    // Refresh based on current filter status
                    refreshBasedOnCurrentFilter();
                } else {
                    toast.error(result.error || 'Failed to add announcement');
                }
            }

            resetForm();
            setShowModal(false);
        } catch (error) {
            console.error('Error saving announcement:', error);
            toast.error('Error saving announcement. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (announcement) => {
        setFormData({
            announcement_type: announcement.announcement_type,
            announcement_title: announcement.announcement_title,
            announcement_description: announcement.announcement_description,
            announcement_img: announcement.announcement_img,
            updated_by: userID,
            start_datetime: announcement.start_datetime.slice(0, 16),
            end_datetime: announcement.end_datetime.slice(0, 16),
            service_ID: announcement.service_ID
        });
        setEditingId(announcement.announcement_ID);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this announcement?')) {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:3000/api/admin/announcements/${id}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });

                const result = await response.json();

                if (response.ok) {
                    toast.success('Announcement deleted successfully!');
                    // Refresh based on current filter status
                    refreshBasedOnCurrentFilter();
                } else {
                    toast.error(result.error || 'Failed to delete announcement');
                }
            } catch (error) {
                console.error('Error deleting announcement:', error);
                toast.error('Error deleting announcement. Please try again.');
            } finally {
                setLoading(false);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            announcement_type: '',
            announcement_title: '',
            announcement_description: '',
            announcement_img: '',
            updated_by: userID,
            start_datetime: '',
            end_datetime: '',
            service_ID: ''
        });
        setEditingId(null);
    };

    const getFilteredAnnouncements = () => {
        let filtered = announcements;

        // Title filter
        if (filters.title) {
            filtered = filtered.filter(ann =>
                ann.announcement_title.toLowerCase().includes(filters.title.toLowerCase())
            );
        }

        // Type filter (by service_ID)
        if (filters.type) {
            filtered = filtered.filter(ann => String(ann.service_ID) === String(filters.type));
        }

        // Date range filter
        if (filters.dateFrom) {
            filtered = filtered.filter(
                ann => new Date(ann.start_datetime) >= new Date(filters.dateFrom)
            );
        }
        if (filters.dateTo) {
            filtered = filtered.filter(
                ann => new Date(ann.start_datetime) <= new Date(filters.dateTo)
            );
        }

        return filtered;
    };


    // Handle status filter change - call appropriate API
    const handleStatusFilterChange = (status) => {
        setFilters(prev => ({ ...prev, status }));

        switch (status) {
            case 'active':
                fetchActiveAnnouncements();
                break;
            case 'upcoming':
                fetchUpcomingAnnouncements();
                break;
            case 'expired':
                fetchOldAnnouncements();
                break;
            case '':
            default:
                fetchAllAnnouncements();
                break;
        }
    };


    // Apply filters whenever they change
    useEffect(() => {
        setFilteredAnnouncements(getFilteredAnnouncements());
    }, [filters, announcements]);

    const getStatusColor = (announcement) => {
        const now = new Date();
        const startDate = new Date(announcement.start_datetime);
        const endDate = new Date(announcement.end_datetime);

        if (endDate < now) return 'bg-gray-100 text-gray-800';
        if (startDate > now) return 'bg-yellow-100 text-yellow-800';
        return 'bg-green-100 text-green-800';
    };

    const getStatusText = (announcement) => {
        const now = new Date();
        const startDate = new Date(announcement.start_datetime);
        const endDate = new Date(announcement.end_datetime);

        if (endDate < now) return 'Expired';
        if (startDate > now) return 'Upcoming';
        return 'Active';
    };

    const getTypeColor = (type) => {
        const colors = {
            general: 'bg-blue-100 text-blue-800',
            urgent: 'bg-red-100 text-red-800',
            promotion: 'bg-purple-100 text-purple-800',
            maintenance: 'bg-orange-100 text-orange-800'
        };
        return colors[type] || 'bg-gray-100 text-gray-800';
    };

    const uniqueTypes = [...new Set(announcements.map(ann => ann.announcement_type))];

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

    if (loading && announcements.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main Content */}
            <div className="p-6">
                {/* Header */}
                <h1 className="text-4xl font-bold text-red-600 mb-6">Announcement Management</h1>

                {/* Filters and Actions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        {/* Filters */}
                        <div className="flex flex-wrap items-center space-x-4 space-y-2 lg:space-y-0">
                            {/* Date Range */}
                            {/* <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <input
                                    type="date"
                                    placeholder="From Date"
                                    value={filters.dateFrom}
                                    onChange={(e) =>
                                        setFilters((prev) => ({ ...prev, dateFrom: e.target.value }))
                                    }
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                                <span className="text-gray-500">to</span>
                                <input
                                    type="date"
                                    placeholder="To Date"
                                    value={filters.dateTo}
                                    onChange={(e) =>
                                        setFilters((prev) => ({ ...prev, dateTo: e.target.value }))
                                    }
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div> */}

                            {/* Title Search */}
                            <div className="flex items-center space-x-2">
                                <Search className="h-4 w-4 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search by title..."
                                    value={filters.title}
                                    onChange={(e) =>
                                        setFilters((prev) => ({ ...prev, title: e.target.value }))
                                    }
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent w-48"
                                />
                            </div>

                            {/* Type Filter */}
                            <select
                                value={filters.type}
                                onChange={(e) =>
                                    setFilters((prev) => ({ ...prev, type: e.target.value }))
                                }
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            >
                                <option value="">All Types</option>
                                {services.map((type) => (
                                    <option key={type} value={type.service_ID}>
                                        {type.service_name}
                                    </option>
                                ))}
                            </select>

                            {/* Status Filter (fixed) */}
                            <select
                                value={filters.status}
                                onChange={(e) => handleStatusFilterChange(e.target.value)} // ✅ use handler
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            >
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="upcoming">Upcoming</option>
                                <option value="expired">Expired</option>
                            </select>
                        </div>


                        {/* Add Button */}
                        <button
                            onClick={() => {
                                resetForm();
                                setShowModal(true);
                            }}
                            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add Announcement</span>
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Loading announcements...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title & Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated By</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredAnnouncements.length > 0 ? (
                                        filteredAnnouncements.map((announcement) => (
                                            <tr key={announcement.announcement_ID} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center cursor-pointer">
                                                        {announcement.announcement_img ? (
                                                            <>
                                                                <img
                                                                    src={announcement.announcement_img}
                                                                    alt={announcement.announcement_title}
                                                                    className="h-12 w-12 rounded-lg object-cover"
                                                                    onClick={() => setShowOverlay(true)}
                                                                    onError={(e) => {
                                                                        e.target.style.display = "none";
                                                                    }}
                                                                />
                                                            </>
                                                        ) : (
                                                            <p className="h-6 w-6 text-red-600">No Image</p>
                                                        )}
                                                    </div>

                                                    {/* Overlay */}
                                                    {showOverlay && (
                                                        <div
                                                            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                                                            onClick={() => setShowOverlay(false)} // close on background click
                                                        >
                                                            <div className="relative">
                                                                <img
                                                                    src={announcement.announcement_img}
                                                                    alt={announcement.announcement_title}
                                                                    className="max-w-full max-h-screen rounded-lg shadow-lg"
                                                                />
                                                                {/* Close button */}
                                                                <button
                                                                    className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                                                                    onClick={() => setShowOverlay(false)}
                                                                >
                                                                    ✕
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex flex-col">
                                                        <div className="text-sm font-medium text-gray-900 mb-1">
                                                            {announcement.announcement_title}
                                                        </div>
                                                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full w-fit ${getTypeColor(announcement.announcement_type)}`}>
                                                            {announcement.announcement_type}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                                                    <div className="truncate">{announcement.announcement_description}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(announcement.start_datetime).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(announcement.end_datetime).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {announcement.first_name + " " + announcement.last_name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(announcement)}`}>
                                                        {getStatusText(announcement)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleEdit(announcement)}
                                                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(announcement.announcement_ID)}
                                                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                                No announcements found
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
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800">
                                {editingId ? 'Edit Announcement' : 'Add New Announcement'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    resetForm();
                                }}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {!editingId && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Announcement Type <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            value={formData.announcement_type}
                                            onChange={(e) => {
                                                const selectedService = services.find(
                                                    (s) => s.service_name === e.target.value
                                                );
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    announcement_type: e.target.value,
                                                    service_ID: selectedService ? selectedService.service_ID : "",
                                                }));
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        >
                                            <option value="">Select a service</option>
                                            {services.map((type) => (
                                                <option key={type.service_ID} value={type.service_name}>
                                                    {type.service_name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Service ID
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.service_ID}
                                            readOnly
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            placeholder="Auto-filled after selecting service"
                                        />
                                    </div>


                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.announcement_title}
                                        onChange={(e) => setFormData(prev => ({ ...prev, announcement_title: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="Enter announcement title"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Image URL
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.announcement_img}
                                        onChange={(e) => setFormData(prev => ({ ...prev, announcement_img: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        placeholder="Enter image URL"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={formData.announcement_description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, announcement_description: e.target.value }))}
                                    rows="4"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                                    placeholder="Enter announcement description"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Start Date & Time <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={formData.start_datetime}
                                        onChange={(e) => setFormData(prev => ({ ...prev, start_datetime: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        End Date & Time <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={formData.end_datetime}
                                        onChange={(e) => setFormData(prev => ({ ...prev, end_datetime: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>


                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                    }}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                                    {editingId ? 'Update' : 'Add'} Announcement
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AnnouncementManagement;