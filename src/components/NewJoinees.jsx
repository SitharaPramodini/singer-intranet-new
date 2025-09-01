import React, { useState, useEffect } from 'react';

const NewJoinees = () => {
  const [newJoinees, setNewJoinees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNewJoinees = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3000/api/employees/new-joinees', {
          credentials: 'include', // if backend uses session
        });
        const data = await response.json();
        if (response.ok) {
          setNewJoinees(data.newJoinees || []);
        } else {
          console.error('Failed to fetch new joinees', data);
          setNewJoinees([]);
        }
      } catch (error) {
        console.error('Error fetching new joinees:', error);
        setNewJoinees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNewJoinees();
  }, []);

  return (
    <div>
      <div className="w-full h-[13rem] relative pt-4 px-6 bg-white border border-gray-200 rounded-lg shadow-sm gridwidth">
        <div className="flex justify-center mb-4 items-center">
          <h5 className="text-xl font-normal leading-none text-gray-400 pt-[0.35rem] h-8 border-r-2 border-gray-300 pr-6">
            {newJoinees.length}
          </h5>
          <h5 className="text-xl font-normal leading-none text-[#eb1c24] pl-6">
            New Comers of The Month
          </h5>
        </div>
        <div className="flow-root">
          <ul
            role="list"
            className="divide-y divide-gray-200 pb-4 h-[8rem] overflow-y-auto custom-scrollbar"
          >
            {loading ? (
              <li className="py-3">Loading...</li>
            ) : newJoinees.length === 0 ? (
              <li className="py-3">No new joinees found</li>
            ) : (
              newJoinees.map((emp, index) => (
                <li key={index} className="py-3 sm:py-4">
                  <div className="flex items-center">
                    <div className="shrink-0">
                      <img src={emp.emp_image} className="w-8 h-8 rounded-full" alt="Employee" />
                    </div>
                    <div className="flex-1 min-w-0 ms-4">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {emp.first_name} {emp.last_name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {emp.dep_name} Department
                      </p>
                    </div>
                    <button className="inline-flex mr-4 items-center px-4 py-1 bg-red-100 hover:bg-red-600 hover:text-white rounded-full text-red-700 text-xs font-medium transition-colors duration-200">
                      {emp.branch_name || "Add a Branch"}
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NewJoinees;





// import React from 'react';

// const NewJoinees = () => {
//   return (
//     <div>
//       <div className="w-full h-[13rem] relative pt-4 px-6 bg-white border border-gray-200 rounded-lg shadow-sm gridwidth">
//         <div className="flex justify-center mb-4 items-center">
//           <h5 className="text-xl font-normal leading-none text-gray-400 pt-[0.35rem] h-8 border-r-2 border-gray-300 pr-6">20</h5>
//           <h5 className="text-xl font-normal leading-none text-[#eb1c24] pl-6">New Comers of The Month</h5>
//         </div>
//         <div className="flow-root">
//           <ul 
//             role="list" 
//             className="divide-y divide-gray-200 pb-4 h-[8rem] overflow-y-auto custom-scrollbar"
//           >
//             {Array(10).fill().map((_, index) => (
//               <li key={index} className="py-3 sm:py-4">
//                 <div className="flex items-center">
//                   <div className="shrink-0">
//                     <img src='emp.jpg' className="w-8 h-8 rounded-full" alt="Employee" />
//                   </div>
//                   <div className="flex-1 min-w-0 ms-4">
//                     <p className="text-sm font-medium text-gray-900 truncate">
//                       Sithara Pramodini
//                     </p>
//                     <p className="text-xs text-gray-500 truncate">
//                       Marketing Department
//                     </p>
//                   </div>
//                   <button className="inline-flex mr-4 items-center px-4 py-1 bg-red-100 hover:bg-red-600 hover:text-white rounded-full text-red-700 text-xs font-medium transition-colors duration-200">
//                     Main branch
//                   </button>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NewJoinees;

