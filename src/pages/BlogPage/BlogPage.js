import React from "react";
import "../../styles/layout.css";
import TrinidadTobegoBlog from "./Blogs/TrinidadTobegoBlog/TrinidadTobegoBlog";

const BlogPage = () => {
  return (
    <div className="page-container blog">
      <div className="container">
        <div className="page-content">
          <h1 className="page-title">Blog</h1>
          <button>TrinidadTobegoBlog</button>
          <TrinidadTobegoBlog />
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
