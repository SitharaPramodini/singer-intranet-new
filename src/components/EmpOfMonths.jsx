import React, { useState, useEffect } from 'react';

const EmpOfMonths = () => {
  const [employees, setEmployees] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch performance or birthdays
  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/employees/new-performance');
        const data = await res.json();

        if (data.success && Array.isArray(data.performances) && data.performances.length > 0) {
          // Map API data to match component structure
          const mappedData = data.performances.map(item => ({
            id: item.emp_ID,
            name: `${item.first_name} ${item.last_name}`,
            branch: item.branch_name,
            title: item.performance_title,
            description: item.description || item.performance_title || 'Recognized for outstanding performance',
            image: item.emp_image
          }));
          setEmployees(mappedData);
        } else {
          // If no performances, fetch birthdays
          const birthdayRes = await fetch('http://localhost:3000/api/employees/today-Bdays');
          const birthdayData = await birthdayRes.json();

          if (birthdayRes.ok && Array.isArray(birthdayData.birthdays)) {
            const mappedBirthdays = birthdayData.birthdays.map(item => ({
              id: item.emp_ID,
              name: `${item.first_name} ${item.last_name}`,
              branch: item.branch_name,
              description: `Happy Birthday! 🎂 Wishing you a wonderful year filled with happiness and success`,
              image: item.emp_image
            }));
            setEmployees(mappedBirthdays);
          }
        }
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };
    fetchPerformance();
  }, []);

  // Handlers
  const handlePrevious = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === 0 ? employees.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === employees.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (employees.length === 0) {
    return (
      <div className="h-[9rem] w-full bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-center">
        <p className="text-gray-500 text-sm">No performance or birthdays today</p>
      </div>
    );
  }

  return (
    <div className="relative h-[9rem] w-full bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-xl hover:scale-[101%] transition-all duration-300 ease-in-out">

      {/* Left Arrow */}
      <button
        onClick={handlePrevious}
        className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full p-2 z-10 hover:bg-gray-100"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Card Container */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {employees.map(employee => (
            <div key={employee.id} className="min-w-full">
              <div className="flex bg-transparent rounded-lg overflow-hidden">
                <img
                  src={employee.image}
                  alt={employee.name}
                  className="w-1/3 h-[8.9rem] object-cover"
                />
                <div className="py-3 pl-6 text-left w-2/3">
                  <h3 className="text-base font-semibold">{employee.name}</h3>
                  <p className='py-1 pr-6 text-xs'>{employee.description}</p>
                  <p className="text-gray-600">
                    <span className="text-sm font-medium">Branch: {employee.branch}</span>
                  </p>
                  <div className="mb-1 mt-2">
                    <span className="inline-block bg-red-100 text-red-700 py-[2px] px-5 rounded-full text-xs font-medium">
                      {employee.description.includes("🎂") ? "Happy Birthday" : employee.title}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Arrow */}
      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full p-2 z-10 hover:bg-gray-100"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicator Dots */}
      <div className="flex justify-center space-x-[6px] mt-[-16px]">
        {employees.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-[6px] w-[6px] rounded-full mb-4 ${currentIndex === index ? 'bg-red-600' : 'bg-gray-300'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default EmpOfMonths;
