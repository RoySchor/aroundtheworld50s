import React from "react";
import "../../../../styles/layout.css";
import "../../../BlogPage/BlogPage.css";
import "./MostRecentPosts.css";
import blogs from "../../../../data/blogs";

const MostRecentPosts = () => {
  const mostRecentBlogs = blogs
    .sort((a, b) => b.created_at - a.created_at)
    .slice(0, 4);

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
                <a href={blog.path} className="blog-link">
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
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MostRecentPosts;
