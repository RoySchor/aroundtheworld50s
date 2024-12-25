import React from "react";
import "../styles/aboutMePage.css";
import aboutMeImage from "../images/about_me_page_image.png";

const AboutMePage = () => {
  return (
    <div className="page-container">
      <div className="relative container">
        <div className="relative aspect-w-16 aspect-h-9 md:w-2/3">
          <img
            src={aboutMeImage}
            alt="About Me"
            className="w-full h-auto max-h-[400px] object-cover rounded-lg shadow-lg"
          />

          <div className="absolute bottom-0 right-24 bg-white p-12 rounded-lg shadow-lg max-w-3xl transform translate-x-2/3 translate-y-1/4">
            <h1 className="text-3xl font-serif font-semibold text-gray-800">
              Hey There
            </h1>
            <p className="text-base text-gray-600 leading-relaxed">
              This is your About Page. It’s a great opportunity to give a full
              background on who you are, what you do, and what your website has
              to offer. Double click on the text box to start editing your
              content and make sure to add all the relevant details you want to
              share with site visitors.
            </p>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="p-16 rounded-lg">
          <h2 className="text-2xl font-serif font-semibold text-gray-800">
            All About Me
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mt-4">
            This is your About Page. This space is a great opportunity to give a
            full background on who you are, what you do, and what your site has
            to offer. Your users are genuinely interested in learning more about
            you, so don’t be afraid to share personal anecdotes to create a more
            friendly quality.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed mt-4">
            Every website has a story, and your visitors want to hear yours.
            This space is a great opportunity to provide any personal details
            you want to share with your followers. Include interesting anecdotes
            and facts to keep readers engaged.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutMePage;
