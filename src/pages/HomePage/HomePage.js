import React from "react";
import "../../styles/layout.css";
import homePageBackground from "../../assets/home_page_background_img.JPG";
import { Link } from "react-router-dom";
import RotatingGallery from "./RotatingGallery";

const HomePage = () => {
  return (
    <div className="relative">
      <div
        className="relative h-screen bg-cover bg-center bg-fixed flex items-center justify-center"
        style={{
          backgroundImage: `url(${homePageBackground})`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <div className="relative z-1 text-center text-white px-4">
          <h1 className="md:text-8xl font-cursive font-bold leading-tight">
            Hi!
          </h1>
          <p className="md:text-5xl mt-20 font-cursive font-bold">
            I'm just a mom traveling the world in my 50s
          </p>
          <button className="mt-32 px-8 py-4 text-xl font-bold font-cursive border-4 border-white rounded-full hover:border-tan hover:text-tan transition duration-300">
            <Link to="/about">Get to know me</Link>
          </button>
        </div>
      </div>

      <div className="bg-white py-20 px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-scope text-left mb-6 text-gray-800">
            Discover. Wonder. Experience. Live
          </h2>
        </div>

        <RotatingGallery />
      </div>
    </div>
  );
};

export default HomePage;
