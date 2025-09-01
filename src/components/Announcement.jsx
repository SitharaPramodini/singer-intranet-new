import React, { useState, useEffect } from 'react';

const Announcement = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchNewJoinees = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:3000/api/employees/announcements/active', {
                    credentials: 'include', // if backend uses session
                });
                const data = await response.json();
                console.log(data)
                if (response.ok) {
                    setAnnouncements(data || []);
                } else {
                    console.error('Failed to fetch new joinees', data);
                    setAnnouncements([]);
                }
            } catch (error) {
                console.error('Error fetching new joinees:', error);
                setAnnouncements([]);
            } finally {
                setLoading(false);
            }
        };

        fetchNewJoinees();
    }, []);

    const handleReadMore = (announcement) => {
        // Check if announcement_type is 'announcement' before opening modal
        console.log(announcement)
        if (announcement.announcement_type === 'Announcements') {
            setSelectedAnnouncement(announcement);
            setIsModalOpen(true);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedAnnouncement(null);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className='h-full pb-5'>
            {/* Red button at the top with Singer සත්කාර text */}
            <h5 className="text-xl font-normal leading-none text-[#eb1c24] mb-4">Announcements</h5>

            {/* Scrollable area for notification cards */}
            <div className="bg-white scrollable w-full overflow-hidden">
                {announcements.map((announcement) => (
                    <div
                        key={announcement.announcement_ID}
                        className={`border-b border-gray-200 last:border-b-0 last:mb-0 bg-white ${announcement.announcement_img ? '' : 'py-4'
                            }`}
                    >
                        {/* Image and Description Overlay */}
                        {announcement.announcement_img ? (
                            <div className="relative">
                                <img
                                    src={announcement.announcement_img}
                                    alt={announcement.announcement_title}
                                    className="w-full object-cover rounded-b-xl"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-4 rounded-b-lg">
                                    <div>
                                        <div className='flex justify-between items-center'>
                                            <h3 className="text-md font-semibold mb-2">{announcement.announcement_title}</h3>
                                            <button
                                                onClick={() => handleReadMore(announcement)}
                                                className="px-4 py-[4px] hover:bg-red-600 bg-[#ffffff4a] border-white hover:border-none text-white rounded-full text-xs font-medium transition-colors duration-200"
                                            >
                                                Read More
                                            </button>
                                        </div>
                                        <p className='text-sm'>
                                            {announcement.announcement_description.split(".")[0] + "."}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // announcement_description when no image is present
                            <div className="px-4">
                                <div className='flex justify-between items-center'>
                                    <h3 className="text-md font-semibold mb-2">{announcement.announcement_title}</h3>
                                    <button
                                        onClick={() => handleReadMore(announcement)}
                                        className="px-4 py-[4px] bg-red-100 hover:bg-red-600 hover:text-white rounded-full text-red-700 text-xs font-medium transition-colors duration-200"
                                    >
                                        Read More
                                    </button>
                                </div>
                                <p className='text-sm'>
                                    {announcement.announcement_description.split(".")[0] + "."}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && selectedAnnouncement && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center py-3 px-6 border-b">
                            <div className='flex items-start flex-col'>
                                <h2 className="text-2xl font-bold text-gray-800">{selectedAnnouncement.announcement_title}</h2>
                                <p className='text-xs font-normal text-gray-400'>
                                    {new Date(selectedAnnouncement.start_datetime).toLocaleString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric"
                                    })}
                                </p>
                            </div>

                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            {selectedAnnouncement.announcement_img ? (
                                // Split layout with image
                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Left side - Image */}
                                    <div className="md:w-1/2">
                                        <img
                                            src={selectedAnnouncement.announcement_img}
                                            alt={selectedAnnouncement.announcement_title}
                                            className="w-full h-auto rounded-lg object-cover"
                                        />
                                    </div>

                                    {/* Right side - Content */}
                                    <div className="md:w-1/2 space-y-4">
                                        <div className="text-gray-700 leading-relaxed">
                                            {selectedAnnouncement.announcement_description}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // Single column layout without image
                                <div className="space-y-4">
                                    <div className="text-gray-700 leading-relaxed">
                                        {selectedAnnouncement.announcement_description}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Announcement;