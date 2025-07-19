import React from "react";
import "../../../../styles/layout.css";
import "../../../BlogPage/BlogPage.css";
import "./MostRecentPosts.css";
import blogs from "../../../../data/blogs";
import { Link } from "react-router-dom";

const MostRecentPosts = () => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      })
      .replace(/\d+/, (day) => {
        const suffixes = { 1: "st", 2: "nd", 3: "rd" };
        const suffix = suffixes[day] || "th";
        return `${day}${suffix}`;
      });
  };

  const mostRecentBlogs = blogs
    .sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateB - dateA; // Sort in descending order (newest first)
    })
    .slice(0, 4); // Get the first 4 posts

  return (
    <div className="recent-posts-container">
      <div className="recent-posts-text-container">
        The Latest from the Blog
      </div>
      <div className="blog-grid">
        {mostRecentBlogs.map((blog) => {
          const imagePath = require(
            `../../../../assets/blog/${blog.folder}/${blog.background_image}`,
          );
          return (
            <div className="blog-item-wrapper" key={blog.id}>
              <div className="blog-item">
                <Link to={blog.path} className="blog-link">
                  <div className="blog-image-wrapper">
                    <div className="most-recent-blog-title">{blog.title}</div>
                    <div
                      className="blog-image"
                      style={{ backgroundImage: `url(${imagePath})` }}
                    >
                      <div className="blog-description">
                        {blog.blog_description}
                      </div>
                    </div>
                  </div>
                  <div className="blog-date">{formatDate(blog.created_at)}</div>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MostRecentPosts;
