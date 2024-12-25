// import React from "react";

// const HomePage = () => {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <h1 className="text-6xl font-bold mb-4">Home/ Hjem</h1>
//         {/* Add your homepage content here */}
//       </div>
//     </div>
//   );
// };

// export default HomePage;

import React from "react";
import "../styles/layout.css";

const HomePage = () => {
  return (
    <div className="page-container">
      <div className="container">
        <div className="page-content">
          <h1 className="home-title">Home/ Hjem</h1>
          {/* Add your homepage content here */}
        </div>
      </div>
    </div>
  );
};

export default HomePage;