import React, { useState, useEffect } from 'react';

const Announcement = () => {
    // Sample announcement data - replace with your actual data
    const announcements = [
        {
            id: 1,
            title: "Singer Special Event",
            description: "Join us for the exclusive Singer සත්කාර event featuring special discounts on all premium appliances.",
            imageUrl: "announcement.jpg"
        },
        {
            id: 2,
            title: "New Product Launch",
            description: "Discover our latest refrigerator models with advanced cooling technology and energy-saving features.",
            // imageUrl: "announcement.jpg"
        },
        {
            id: 3,
            title: "Holiday Season Sale",
            description: "Celebrate the season with up to 40% off on selected Singer products. Limited time offer.",
            // imageUrl: "announcement.jpg"
        },
        {
            id: 4,
            title: "Service Center Updates",
            description: "We've expanded our service network. Find the nearest Singer service center in your area.",
            imageUrl: "announcement.jpg"
        },
        {
            id: 2,
            title: "New Product Launch",
            description: "Discover our latest refrigerator models with advanced cooling technology and energy-saving features.",
            // imageUrl: "announcement.jpg"
        },
        {
            id: 3,
            title: "Holiday Season Sale",
            description: "Celebrate the season with up to 40% off on selected Singer products. Limited time offer.",
            // imageUrl: "announcement.jpg"
        },
        {
            id: 5,
            title: "Customer Appreciation Day",
            description: "Thank you for your loyalty! Join us for special in-store events and exclusive member offers.",
            // imageUrl: "announcement.jpg"
        },
        {
            id: 3,
            title: "Holiday Season Sale",
            description: "Celebrate the season with up to 40% off on selected Singer products. Limited time offer.",
            // imageUrl: "announcement.jpg"
        },
        {
            id: 4,
            title: "Service Center Updates",
            description: "We've expanded our service network. Find the nearest Singer service center in your area.",
            imageUrl: "announcement.jpg"
        },
    ];

    return (
        <div className='h-full pb-5'>
            
            {/* Red button at the top with Singer සත්කාර text */}
            <h5 class="text-xl font-normal leading-none text-[#eb1c24] mb-4">Announcements</h5>

            {/* Scrollable area for notification cards */}
            <div className="bg-white scrollable w-full overflow-hidden">
                {announcements.map((announcement) => (
                    <div
                        key={announcement.id}
                        className={`border-b border-gray-200 last:border-b-0 last:mb-0 bg-white ${announcement.imageUrl ? '' : 'py-4'
                            }`}
                    >
                        {/* Image and Description Overlay */}
                        {announcement.imageUrl ? (
                            <div className="relative">
                                <img
                                    src={announcement.imageUrl}
                                    alt={announcement.title}
                                    className="w-full object-cover rounded-b-xl"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-4 rounded-b-lg">
                                    <h3 className="text-md font-semibold">{announcement.title}</h3>
                                    <p className='text-sm'>{announcement.description}</p>
                                </div>
                            </div>
                        ) : (
                            // Description when no image is present
                            <div className="px-4">
                                <div className='flex justify-between items-center'>
                                    <h3 className="text-md font-semibold mb-2">{announcement.title}</h3>
                                    <button className="px-4 py-[4px] bg-red-100 hover:bg-red-600 hover:text-white rounded-full text-red-700 text-xs font-medium transition-colors duration-200">
                                        Learn More
                                    </button>
                                </div>
                                <p className="text-gray-600 text-sm">{announcement.description}</p>
                            </div>
                        )}
                    </div>
                ))}


            </div>
        </div>
    );
};

export default Announcement;