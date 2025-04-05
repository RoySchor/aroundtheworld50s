import React from "react";
import { Link } from "react-router-dom";
import siteLogo from "../../assets/around_the_world_50s_logo.png";

const ErrorPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <img
        src={siteLogo}
        alt="Around the World 50s Logo"
        className="w-32 h-32 mb-8 animate-bounce"
      />
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Oops! Page Not Found
      </h1>
      <p className="text-xl text-gray-600 mb-8 text-center">
        Looks like you've wandered off the map! Let's get you back on track.
      </p>
      <Link
        to="/"
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
      >
        Return Home
      </Link>
    </div>
  );
};

export default ErrorPage;
