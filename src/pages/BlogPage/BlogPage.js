import React from "react";
import "../../styles/layout.css";
import { Link } from "react-router-dom";
import TrinidadTobegoPost1 from "./Blogs/TrinidadTobegoBlog/TrinidadTobegoPost1";

const BlogPage = () => {
  return (
    <div className="page-container blog">
      <div className="container">
        <div className="page-content">
          <h1 className="page-title">Blog</h1>
          <Link to="/blog/trinidad-tobego-post/1">Trinidad Tobego Blog</Link>
          <TrinidadTobegoPost1 />
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
