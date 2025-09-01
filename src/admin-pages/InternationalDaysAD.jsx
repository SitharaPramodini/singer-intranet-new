import React, { useState, useEffect } from 'react';
import AdminHeader from '../admin-components/AdminHeader';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Plus, Search, Filter, Edit, Trash2, X, Calendar, Globe, FileText, AlertCircle, Image } from 'lucide-react';

export default function InternationalDaysAD() {
    // User session state
    const [userID, setUserID] = useState(null);
    const [userRole, setUserRole] = useState(null);

    // State for international days data
    const [internationalDays, setInternationalDays] = useState([]);
    const [filteredDays, setFilteredDays] = useState([]);
    const [loading, setLoading] = useState(false);

    // Filter states
    const [filters, setFilters] = useState({
        month: '',
        day: '',
        title: ''
    });

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Form states
    const [formData, setFormData] = useState({
        day_title: '',
        day_description: '',
        date: '',
        day_image: ''
    });

    // Month names for display
    const months = [
        { value: '01', label: 'January' },
        { value: '02', label: 'February' },
        { value: '03', label: 'March' },
        { value: '04', label: 'April' },
        { value: '05', label: 'May' },
        { value: '06', label: 'June' },
        { value: '07', label: 'July' },
        { value: '08', label: 'August' },
        { value: '09', label: 'September' },
        { value: '10', label: 'October' },
        { value: '11', label: 'November' },
        { value: '12', label: 'December' }
    ];

    // Generate days 1-31
    const days = Array.from({ length: 31 }, (_, i) => ({
        value: String(i + 1).padStart(2, '0'),
        label: String(i + 1)
    }));

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

    // Fetch international days on component mount
    useEffect(() => {
        if (userRole === 'admin') {
            fetchInternationalDays();
        }
    }, [userRole]);

    // API Functions
    const fetchInternationalDays = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/api/admin/internationalDays/', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            if (data.success) {
                setInternationalDays(data.days);
                setFilteredDays(data.days);
            } else {
                toast.error('Failed to fetch international days', 'error');
            }
        } catch (error) {
            console.error('Error fetching international days:', error);
            toast.error('Error fetching international days', 'error');
        } finally {
            setLoading(false);
        }
    };

    const createInternationalDay = async (dayData) => {
        try {
            const dataToSend = {
                ...dayData,
                added_by: userID
            };

            const response = await fetch('http://localhost:3000/api/admin/internationalDays/', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend)
            });
            const data = await response.json();
            if (data.success) {
                toast.success('International day created successfully!', 'success');
                fetchInternationalDays();
                return true;
            } else {
                toast.error(data.message || 'Failed to create international day', 'error');
                return false;
            }
        } catch (error) {
            console.error('Error creating international day:', error);
            toast.error('Error creating international day', 'error');
            return false;
        }
    };

    const updateInternationalDay = async (id, dayData) => {
        try {
            const response = await fetch(`http://localhost:3000/api/admin/internationalDays/${id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dayData)
            });
            const data = await response.json();
            if (data.success) {
                toast.success('International day updated successfully!', 'success');
                fetchInternationalDays();
                return true;
            } else {
                toast.error(data.message || 'Failed to update international day', 'error');
                return false;
            }
        } catch (error) {
            console.error('Error updating international day:', error);
            toast.error('Error updating international day', 'error');
            return false;
        }
    };

    const deleteInternationalDay = async (id) => {
        if (!window.confirm('Are you sure you want to delete this international day?')) {
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/api/admin/internationalDays/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });
            const data = await response.json();
            if (data.success) {
                toast.success('International day deleted successfully!', 'success');
                fetchInternationalDays();
            } else {
                toast.error(data.message || 'Failed to delete international day', 'error');
            }
        } catch (error) {
            console.error('Error deleting international day:', error);
            toast.error('Error deleting international day', 'error');
        }
    };

    // Apply filters
    useEffect(() => {
        let filtered = internationalDays;

        if (filters.title) {
            filtered = filtered.filter(day =>
                day.day_title.toLowerCase().includes(filters.title.toLowerCase())
            );
        }

        if (filters.month) {
            filtered = filtered.filter(day => {
                const dayMonth = day.day_month.split('-')[0];
                return dayMonth === filters.month;
            });
        }

        if (filters.day) {
            filtered = filtered.filter(day => {
                const dayDay = day.day_month.split('-')[1];
                return dayDay === filters.day;
            });
        }

        setFilteredDays(filtered);
    }, [filters, internationalDays]);

    // Handle form submission
    const handleSubmit = async () => {

        if (!formData.day_title || !formData.date) {
            toast.warning('Please fill in all required fields', 'error');
            return;
        }

        const success = editingId
            ? await updateInternationalDay(editingId, formData)
            : await createInternationalDay(formData);

        if (success) {
            handleCloseModal();
        }
    };

    // Handle edit
    const handleEdit = async (day) => {
        setEditingId(day.day_ID);

        try {
            const response = await fetch(`http://localhost:3000/api/admin/internationalDays/${day.day_ID}`, {
                credentials: 'include'
            });
            const data = await response.json();

            if (data.success) {
                const dayData = data.day;
                setFormData({
                    day_title: dayData.day_title || '',
                    day_description: dayData.day_description || '',
                    date: dayData.date ? dayData.date.split('T')[0] : '',
                    day_image: dayData.day_image || ''
                });
                setShowModal(true);
            }
        } catch (error) {
            console.error('Error fetching day details:', error);
            toast.error('Error fetching day details', 'error');
        }
    };

    // Handle close modal
    const handleCloseModal = () => {
        setShowModal(false);
        setEditingId(null);
        setFormData({
            day_title: '',
            day_description: '',
            date: '',
            day_image: ''
        });
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const [month, day] = dateString.split('-');
        const monthName = months.find(m => m.value === month)?.label || '';
        return `${monthName} ${parseInt(day)}`;
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

                <h1 className="text-4xl font-bold text-red-600 mb-6">International Days</h1>

                {/* Filters and Actions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                        {/* Filters */}
                        <div className="flex flex-wrap items-center space-x-4 space-y-2 lg:space-y-0">
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

                            <div className="flex items-center space-x-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <select
                                    value={filters.month}
                                    onChange={(e) => setFilters(prev => ({ ...prev, month: e.target.value }))}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                >
                                    <option value="">All Months</option>
                                    {months.map(month => (
                                        <option key={month.value} value={month.value}>{month.label}</option>
                                    ))}
                                </select>

                                <select
                                    value={filters.day}
                                    onChange={(e) => setFilters(prev => ({ ...prev, day: e.target.value }))}
                                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                >
                                    <option value="">All Days</option>
                                    {days.map(day => (
                                        <option key={day.value} value={day.value}>{day.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Add Button */}
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add International Day</span>
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Loading international days...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added By</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredDays.length > 0 ? (
                                        filteredDays.map((day) => (
                                            <tr key={day.day_ID} className="hover:bg-gray-50">
                                                <td className="px-6 py-3 whitespace-nowrap">
                                                    <div className="h-8 w-8 bg-red-100 rounded-lg flex items-center justify-center">
                                                        {day.day_image ? (
                                                            <img
                                                                src={day.day_image}
                                                                alt={day.day_title}
                                                                className="h-8 w-8 rounded-lg object-cover"
                                                                onError={(e) => {
                                                                    e.target.style.display = 'none';
                                                                    e.target.nextSibling.style.display = 'flex';
                                                                }}
                                                            />
                                                        ) : null}
                                                        <Globe className="h-6 w-6 text-red-600" style={{ display: day.day_image ? 'none' : 'block' }} />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{day.day_title}</div>
                                                </td>
                                                <td className="px-6 py-3 text-sm text-gray-900 max-w-xs">
                                                    <div className="truncate" title={day.day_description}>
                                                        {day.day_description || 'No description'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900 font-medium">
                                                        {formatDate(day.day_month)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                                                    {day.added_by}
                                                </td>
                                                <td className="px-6 py-3 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleEdit(day)}
                                                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                                            title="Edit"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteInternationalDay(day.day_ID)}
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
                                            <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                                No international days found
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
                                {editingId ? 'Edit International Day' : 'Add New International Day'}
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
                                {/* Day Title */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Day Title <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <input
                                            type="text"
                                            value={formData.day_title}
                                            onChange={(e) => setFormData(prev => ({ ...prev, day_title: e.target.value }))}
                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            placeholder="e.g., World Environment Day"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Date <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <input
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Day Image URL */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Image URL
                                    </label>
                                    <div className="relative">
                                        <Image className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <input
                                            type="url"
                                            value={formData.day_image}
                                            onChange={(e) => setFormData(prev => ({ ...prev, day_image: e.target.value }))}
                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            placeholder="https://example.com/image.jpg"
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <textarea
                                            value={formData.day_description}
                                            onChange={(e) => setFormData(prev => ({ ...prev, day_description: e.target.value }))}
                                            rows="4"
                                            maxLength={60}
                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            placeholder="Describe the significance of this international day..."
                                        />
                                        <p className="text-xs text-gray-400 mt-1">{formData.day_description.length}/60 characters</p>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Buttons */}
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
            )}
        </div>
    );
}