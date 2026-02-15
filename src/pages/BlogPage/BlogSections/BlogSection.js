import React from "react";
import "../../../styles/layout.css";
import "../BlogPage.css";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import blogs from "../../../data/blogs";
import { getBlogImageUrl } from "../../../utils/cloudinary";

const BlogSection = ({ country }) => {
  let filteredBlogs;

  // Helper function to normalize text for comparison
  const normalizeText = (text) => text.toLowerCase().trim();

  if (country.includes(", ")) {
    const [state, countryName] = country.split(", ");
    const normalizedState = normalizeText(state);
    const normalizedCountry = normalizeText(countryName);

    filteredBlogs = blogs.filter(
      (blog) =>
        normalizeText(blog.country) === normalizedCountry &&
        normalizeText(blog.state || "") === normalizedState,
    );
  } else {
    const normalizedCountry = normalizeText(country);
    filteredBlogs = blogs.filter(
      (blog) => normalizeText(blog.country) === normalizedCountry,
    );
  }

  // Sort blogs by date, newest first
  filteredBlogs.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const background =
    filteredBlogs.length > 0
      ? getBlogImageUrl(filteredBlogs[0].folder, filteredBlogs[0].background_image)
      : null;

  return (
    <div className="page-container">
      <div
        className="fixed-background-container"
        style={{
          backgroundImage: `url(${background})`,
        }}
      >
        <div className="fixed-background-text-container">
          <div className="fixed-background-title fixed-background-no-margin">
            {country}
          </div>
        </div>
      </div>

      <div className="container">
        <div className="page-content">
          <h1 className="page-title">{country}</h1>
          <div className="blog-grid">
            {filteredBlogs.map((blog) => {
              const imagePath = getBlogImageUrl(blog.folder, blog.background_image);
              return (
                <div className="blog-item-wrapper" key={blog.id}>
                  <div className="blog-item">
                    <Link to={blog.path} className="blog-link">
                      <div className="blog-image-wrapper">
                        <div className="blog-title">{blog.title}</div>
                        <div className="blog-date">
                          {new Date(blog.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </div>
                        <div
                          className="blog-image"
                          style={{ backgroundImage: `url(${imagePath})` }}
                        >
                          <div className="blog-description">
                            {blog.blog_description}
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
