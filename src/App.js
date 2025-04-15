import React from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  useParams,
} from "react-router-dom";
import blogs from "./data/blogs";
import { serializeLocation } from "./pages/DestinationsPage/DestinationPage.utils";

import Navbar from "./components/Navbar/Navbar";
import HomePage from "./pages/HomePage/HomePage";
import AboutMePage from "./pages/AboutMePage/AboutMePage";
import DestinationsPage from "./pages/DestinationsPage/DestinationsPage";
import BlogPage from "./pages/BlogPage/BlogPage";
import BlogSection from "./pages/BlogPage/BlogSections/BlogSection";
import SpecialsPage from "./pages/SpecialsPage";
import TipsPage from "./pages/TipsPage/TipsPage";
import ErrorPage from "./pages/ErrorPage/ErrorPage";

// import TrinidadTobegoPost1 from "./pages/BlogPage/Blogs/trinidad-and-tobago/1/TrinidadTobegoPost1";
import TrinidadTobegoPost1 from "./pages/BlogPage/Blogs/trinidad-and-tobago/1/TrinidadTobegoPost1.tsx";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutMePage />} />
        <Route path="/destinations" element={<DestinationsPage />} />
        <Route path="/special-pop-ups" element={<SpecialsPage />} />
        <Route path="/tips" element={<TipsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:postName/:index" element={<BlogPost />} />
        <Route path="/blog/:country" element={<BlogSectionPage />} />

        {/* Catch all invalid routes */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

function BlogPost() {
  const { postName, index } = useParams();

  // Find the blog post by country name and index
  const blog = blogs.find(
    (blog) =>
      serializeLocation(blog.country) === postName &&
      blog.path.endsWith(`/${index}`),
  );

  if (!blog) {
    return <ErrorPage />;
  }

  // Render the appropriate blog post component
  switch (postName) {
    case "trinidad-and-tobago":
      if (index === "1") {
        return <TrinidadTobegoPost1 />;
      }
      break;
    default:
      return <ErrorPage />;
  }
}

function BlogSectionPage() {
  const { country } = useParams();

  // Find all blogs for this country
  const countryBlogs = blogs.filter(
    (blog) => serializeLocation(blog.country) === country,
  );

  if (countryBlogs.length === 0) {
    return <ErrorPage />;
  }

  return <BlogSection country={countryBlogs[0].country} />;
}

export default App;
