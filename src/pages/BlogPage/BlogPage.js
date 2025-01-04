import React from "react";
import "../../styles/layout.css";
import "./BlogPage.css";
import { Link } from "react-router-dom";
import blogs from "../../data/blogs";

const BlogPage = () => {
  return (
    <div className="page-container blog">
      <div className="container">
        <div className="page-content">
          <h1 className="page-title">Blog</h1>
          <div className="blog-grid">
            {blogs.map((blog) => {
              const imagePath = require(
                `../../assets/blog/${blog.folder}/${blog.background_image}.jpg`,
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
