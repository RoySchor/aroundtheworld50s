import React from "react";
import "../../../styles/layout.css";
import "../BlogPage.css";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import blogs from "../../../data/blogs";

const BlogSection = ({ country }) => {
  const filteredBlogs = blogs.filter((blog) => blog.country === country);

  const background =
    filteredBlogs.length > 0
      ? require(
          `../../../assets/blog/${filteredBlogs[0].folder}/${filteredBlogs[0].backgroundImage}.jpg`,
        )
      : null;

  return (
    <div className="page-container">
      <div
        className="fixed-background-container"
        style={{
          backgroundImage: `url(${background})`,
        }}
      >
        <div className="destination-page-background-configure" />

        <div className="blog-sections-fixed-background-text-container">
          Category: {country}
        </div>
      </div>

      <div className="container">
        <div className="page-content">
          <h1 className="page-title">{country}</h1>
          <div className="blog-grid">
            {filteredBlogs.map((blog) => {
              const imagePath = require(
                `../../../assets/blog/${blog.folder}/${blog.backgroundImage}.jpg`,
              );
              return (
                <div className="blog-item-wrapper" key={blog.id}>
                  <div className="blog-item">
                    <Link to={blog.path} className="blog-link">
                      <div className="blog-image-wrapper">
                        <div className="blog-title">{blog.title}</div>

                        <div
                          className="blog-image"
                          style={{ backgroundImage: `url(${imagePath})` }}
                        >
                          <div className="blog-description">
                            {blog.blogDescription}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

BlogSection.propTypes = {
  country: PropTypes.string.isRequired,
};

export default BlogSection;
