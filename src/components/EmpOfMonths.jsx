import React, { useState } from 'react';

const EmpOfMonths = () => {
  // Sample employee data - replace with your actual data
  const employees = [
    {
      id: 1,
      name: "Sithara Pramodini",
      branch: "Colombo Central",
      description: "Recognized for outstanding performance, dedication, and teamwork. Keep up the great work!",
      image: "emp.jpg"
    },
    {
      id: 2,
      name: "Sewmini Samarasinghe",
      branch: "Kandy Main",
      description: "Recognized for outstanding performance, dedication, and teamwork. Keep up the great work!",
      image: "emp.jpg"
    },
    {
      id: 3,
      name: "Sandeepa Sewmini",
      branch: "Galle Branch",
      description: "Recognized for outstanding performance, dedication, and teamwork. Keep up the great work!",
      image: "emp.jpg"
    },
    {
      id: 4,
      name: "Sanduni Rajapakse",
      branch: "Negombo Branch",
      description: "Recognized for outstanding performance, dedication, and teamwork. Keep up the great work!",
      image: "emp.jpg"
    },
    {
      id: 5,
      name: "Dinesh Kumar",
      branch: "Jaffna Main",
      description: "Recognized for outstanding performance, dedication, and teamwork. Keep up the great work!",
      image: "emp.jpg"
    }
  ];

  // State to track current card index
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handler for previous button
  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? employees.length - 1 : prevIndex - 1
    );
  };

  // Handler for next button
  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === employees.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
<div className="relative w-full bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-xl hover:scale-[101%] transition-all duration-300 ease-in-out">
{/* Left Arrow */}
    {/* <h5 class="text-xl font-bold leading-none text-[#eb1c24] px-4 py-3">Employee of The Month</h5> */}

    <button 
      onClick={handlePrevious}
      className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full p-2 z-10 hover:bg-gray-100"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 opacity-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
    
    {/* Card Container */}
    <div className="overflow-hidden">
      <div 
        className="flex transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {employees.map((employee) => (
          <div 
            key={employee.id} 
            className="min-w-full"
          >
            <div className="flex bg-white rounded-lg overflow-hidden">
              {/* Employee Image */}
              <img 
                src={employee.image} 
                alt={employee.name} 
                className=" w-1/3 object-cover"
              />
              
              {/* Employee Details */}
              <div className="py-6 pl-6  text-left w-2/3">
                <h3 className="text-lg font-semibold ">{employee.name}</h3>
                <p className='py-2 pr-6 text-sm'>{employee.description}</p>
                <p className="text-gray-600">
                  <span className="font-medium">Branch:</span> {employee.branch}
                </p>
                <div className="mt-4">
                  <span className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
                    Star Performer
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
      className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full p-2  z-10 hover:bg-gray-100"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 opacity-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>

    {/* Indicator Dots */} 
       <div className="flex justify-center space-x-2">
         {employees.map((_, index) => (
           <button
             key={index}
             onClick={() => setCurrentIndex(index)}
             className={`h-2 w-2 rounded-full ${
               currentIndex === index ? 'bg-red-600' : 'bg-gray-300'
             }`}
           />
         ))}
       </div>
  </div>
  );
};

export default EmpOfMonths;




// import React, { useState } from 'react';

// const EmpOfMonths = () => {
//   // Sample employee data - replace with your actual data
//   const employees = [
//     {
//       id: 1,
//       name: "Priya Sharma",
//       branch: "Colombo Central",
//       description: "Recognized for outstanding performance, dedication, and teamwork. Keep up the great work!",
//       image: "emp.jpg"
//     },
//     {
//       id: 2,
//       name: "Amal Fernando",
//       branch: "Kandy Main",
//       description: "Recognized for outstanding performance, dedication, and teamwork. Keep up the great work!",
//       image: "emp.jpg"
//     },
//     {
//       id: 3,
//       name: "Nimal Perera",
//       branch: "Galle Branch",
//       description: "Recognized for outstanding performance, dedication, and teamwork. Keep up the great work!",
//       image: "emp.jpg"
//     },
//     {
//       id: 4,
//       name: "Kumari Jayawardena",
//       branch: "Negombo Branch",
//       description: "Recognized for outstanding performance, dedication, and teamwork. Keep up the great work!",
//       image: "emp.jpg"
//     },
//     {
//       id: 5,
//       name: "Dinesh Kumar",
//       branch: "Jaffna Main",
//       description: "Recognized for outstanding performance, dedication, and teamwork. Keep up the great work!",
//       image: "emp.jpg"
//     }
//   ];

//   // State to track current card index
//   const [currentIndex, setCurrentIndex] = useState(0);

//   // Handler for previous button
//   const handlePrevious = () => {
//     setCurrentIndex((prevIndex) => 
//       prevIndex === 0 ? employees.length - 1 : prevIndex - 1
//     );
//   };

//   // Handler for next button
//   const handleNext = () => {
//     setCurrentIndex((prevIndex) => 
//       prevIndex === employees.length - 1 ? 0 : prevIndex + 1
//     );
//   };

//   return (
//     <div>      
//         {/* <p className='text-red-600 mb-4'>Employee of the month</p> */}
//       <div className="relative w-full bg-white border border-gray-200 rounded-lg shadow-sm">
//         {/* Left Arrow */}
//         <button 
//           onClick={handlePrevious}
//           className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full p-2 z-10 hover:bg-gray-100"
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 opacity-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//           </svg>
//         </button>
        
//         {/* Card Container */}
//         <div className="overflow-hidden">
//           <div 
//             className="flex transition-transform duration-300 ease-in-out"
//             style={{ transform: `translateX(-${currentIndex * 100}%)` }}
//           >
//             {employees.map((employee) => (
//               <div 
//                 key={employee.id} 
//                 className="min-w-full"
//               >
//                 <div className="flex bg-white rounded-lg overflow-hidden">
//                   {/* Employee Image */}
//                   <img 
//                     src={employee.image} 
//                     alt={employee.name} 
//                     className=" w-1/3 object-cover"
//                   />
                  
//                   {/* Employee Details */}
//                   <div className="py-6 pl-6  text-left w-2/3">
//                     <h3 className="text-lg font-semibold ">{employee.name}</h3>
//                     <p className='py-2 text-sm'>{employee.description}</p>
//                     <p className="text-gray-600">
//                       <span className="font-medium">Branch:</span> {employee.branch}
//                     </p>
//                     <div className="mt-4">
//                       <span className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
//                         Star Performer
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
        
//         {/* Right Arrow */}
//         <button 
//           onClick={handleNext}
//           className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full p-2  z-10 hover:bg-gray-100"
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 opacity-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//           </svg>
//         </button>
//       </div>
      
//       {/* Indicator Dots */}
//       {/* <div className="flex justify-center space-x-2">
//         {employees.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => setCurrentIndex(index)}
//             className={`h-2 w-2 rounded-full ${
//               currentIndex === index ? 'bg-blue-600' : 'bg-gray-300'
//             }`}
//           />
//         ))}
//       </div> */}
//     </div>
//   );
// };

// export default EmpOfMonths;