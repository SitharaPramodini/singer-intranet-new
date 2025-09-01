import React, { useState, useEffect } from "react";

const Announcement = ({ onLoadComplete }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true); // start loading by default
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/employees/announcements/active",
          { credentials: "include" }
        );
        const data = await response.json();

        if (response.ok) {
          setAnnouncements(data || []);
          // Wait for all images to preload
          await preloadImages(data);
        } else {
          console.error("Failed to fetch announcements", data);
          setAnnouncements([]);
        }
      } catch (error) {
        console.error("Error fetching announcements:", error);
        setAnnouncements([]);
      } finally {
        setLoading(false);
        if (onLoadComplete) onLoadComplete();
      }
    };

    fetchAnnouncements();
  }, [onLoadComplete]);

  // Helper: preload images to avoid "pop-in"
  const preloadImages = (data) => {
    const imageUrls = data
      .filter((a) => a.announcement_img)
      .map((a) => a.announcement_img);

    return Promise.all(
      imageUrls.map(
        (src) =>
          new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = resolve;
            img.onerror = resolve; // ignore errors, resolve anyway
          })
      )
    );
  };

  const handleReadMore = (announcement) => {
    if (announcement.announcement_type === "Announcements") {
      setSelectedAnnouncement(announcement);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAnnouncement(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-full pb-5">
      <h5 className="text-xl font-normal leading-none text-[#eb1c24] mb-4">
        Announcements
      </h5>

      {/* Announcements List */}
      <div className="bg-white scrollable w-full overflow-hidden">
        {announcements.length === 0 && (
          <p className="text-gray-500 text-sm px-4 py-6">
            No announcements available.
          </p>
        )}
        {announcements.map((announcement) => (
          <div
            key={announcement.announcement_ID}
            className={`border-b border-gray-200 last:border-b-0 last:mb-0 bg-white ${
              announcement.announcement_img ? "" : "py-4"
            }`}
          >
            {announcement.announcement_img ? (
              <div className="relative">
                <img
                  src={announcement.announcement_img}
                  alt={announcement.announcement_title}
                  className="w-full object-cover rounded-b-xl"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-4 rounded-b-lg">
                  <div>
                    <div className="flex justify-between items-center">
                      <h3 className="text-md font-semibold mb-2">
                        {announcement.announcement_title}
                      </h3>
                      <button
                        onClick={() => handleReadMore(announcement)}
                        className="px-4 py-[4px] hover:bg-red-600 bg-[#ffffff4a] border-white hover:border-none text-white rounded-full text-xs font-medium transition-colors duration-200"
                      >
                        Read More
                      </button>
                    </div>
                    <p className="text-sm">
                      {announcement.announcement_description.split(".")[0] + "."}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-md font-semibold mb-2">
                    {announcement.announcement_title}
                  </h3>
                  <button
                    onClick={() => handleReadMore(announcement)}
                    className="px-4 py-[4px] bg-red-100 hover:bg-red-600 hover:text-white rounded-full text-red-700 text-xs font-medium transition-colors duration-200"
                  >
                    Read More
                  </button>
                </div>
                <p className="text-sm">
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
            <div className="flex justify-between items-center py-3 px-6 border-b">
              <div className="flex items-start flex-col">
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedAnnouncement.announcement_title}
                </h2>
                <p className="text-xs font-normal text-gray-400">
                  {new Date(
                    selectedAnnouncement.start_datetime
                  ).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
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

            <div className="p-6">
              {selectedAnnouncement.announcement_img ? (
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/2">
                    <img
                      src={selectedAnnouncement.announcement_img}
                      alt={selectedAnnouncement.announcement_title}
                      className="w-full h-auto rounded-lg object-cover"
                    />
                  </div>
                  <div className="md:w-1/2 space-y-4">
                    <div className="text-gray-700 leading-relaxed">
                      {selectedAnnouncement.announcement_description}
                    </div>
                  </div>
                </div>
              ) : (
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
