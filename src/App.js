import React from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  useParams,
} from "react-router-dom";
import blogs from "./data/blogs";

import Navbar from "./components/Navbar/Navbar";
import HomePage from "./pages/HomePage/HomePage";
import AboutMePage from "./pages/AboutMePage/AboutMePage";
import DestinationsPage from "./pages/DestinationsPage/DestinationsPage";
import BlogPage from "./pages/BlogPage/BlogPage";
import BlogSection from "./pages/BlogPage/BlogSections/BlogSection";
import TipsPage from "./pages/TipsPage/TipsPage";
import TipDetailPage from "./pages/TipsPage/TipDetailPage";
import AdminPage from "./pages/AdminPage/AdminPage";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import TrinidadandTobagoPost1 from "./pages/BlogPage/Blogs/trinidad-and-tobago/1/TrinidadandTobagoPost1.tsx";
import UnitedStatesConnecticutPost1 from "./pages/BlogPage/Blogs/united-states-connecticut/1/UnitedStatesConnecticutPost1.tsx";
import UnitedStatesRhodeIslandPost1 from "./pages/BlogPage/Blogs/united-states-rhode-island/1/UnitedStatesRhodeIslandPost1.tsx";
import UnitedStatesMassachusettsPost1 from "./pages/BlogPage/Blogs/united-states-massachusetts/1/UnitedStatesMassachusettsPost1.tsx";
import TrinidadAndTobagoPost2 from "./pages/BlogPage/Blogs/trinidad-and-tobago/2/TrinidadAndTobagoPost2.tsx";
import TrinidadAndTobagoPost3 from "./pages/BlogPage/Blogs/trinidad-and-tobago/3/TrinidadAndTobagoPost3.tsx";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutMePage />} />
        <Route path="/destinations" element={<DestinationsPage />} />
        <Route path="/tips" element={<TipsPage />} />
        <Route path="/tips/:location" element={<TipDetailPage />} />
        <Route path="/admin" element={<AdminPage />} />
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

  const targetPath = `/blog/${postName}/${index}`;
  const blog = blogs.find((blog) => blog.path === targetPath);

  if (!blog) {
    return <ErrorPage />;
  }

  switch (postName) {
    case "trinidad-and-tobago":
      if (index === "1") {
        return <TrinidadandTobagoPost1 />;
      }
      if (index === "2") {
        return <TrinidadAndTobagoPost2 />;
      }
      if (index === "3") {
        return <TrinidadAndTobagoPost3 />;
      }
      break;
    case "united-states-connecticut":
      if (index === "1") {
        return <UnitedStatesConnecticutPost1 />;
      }
      break;
    case "united-states-rhode-island":
      if (index === "1") {
        return <UnitedStatesRhodeIslandPost1 />;
      }
      break;
    case "united-states-massachusetts":
      if (index === "1") {
        return <UnitedStatesMassachusettsPost1 />;
      }
      break;
    default:
      return <ErrorPage />;
  }
}

function BlogSectionPage() {
  const { country } = useParams();

  // Find all blogs for this location (country or US state)
  const locationBlogs = blogs.filter((blog) => {
    // Extract the location part from the blog path (remove /blog/ and /index)
    const blogLocation = blog.path.split("/")[2]; // /blog/location/index -> location
    return blogLocation === country;
  });

  if (locationBlogs.length === 0) {
    return <ErrorPage />;
  }

  // Helper function to properly capitalize words
  const capitalizeWords = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const displayName = locationBlogs[0].state
    ? `${capitalizeWords(locationBlogs[0].state)}, ${locationBlogs[0].country}`
    : locationBlogs[0].country;

  return <BlogSection country={displayName} />;
}

export default App;
