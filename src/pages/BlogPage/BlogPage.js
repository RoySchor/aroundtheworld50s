import React from "react";
import "../../styles/layout.css";
import "./BlogPage.css";
import { Link } from "react-router-dom";
import blogs from "../../data/blogs";

const BlogPage = () => {
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

  const sortedBlogs = [...blogs].sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return dateB - dateA; // Sort in descending order (newest first)
  });

  return (
    <div className="page-container blog">
      <div className="container">
        <div className="page-content">
          <h1 className="page-title">Blog</h1>
          <div className="blog-grid">
            {sortedBlogs.map((blog) => {
              const imagePath = require(
                `../../assets/blog/${blog.folder}/${blog.background_image}`,
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
                            {blog.blog_description}
                          </div>
                        </div>
                      </div>
                      <div className="blog-date">
                        {formatDate(blog.created_at)}
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

export default BlogPage;
