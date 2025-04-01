import React from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  useParams,
  Navigate,
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

import TrinidadTobegoPost1 from "./pages/BlogPage/Blogs/TrinidadTobegoBlog/TrinidadTobegoPost1";

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

        {/* Redirect non-hash routes to hash routes */}
        <Route path="about" element={<Navigate to="/#/about" replace />} />
        <Route
          path="destinations"
          element={<Navigate to="/#/destinations" replace />}
        />
        <Route
          path="special-pop-ups"
          element={<Navigate to="/#/special-pop-ups" replace />}
        />
        <Route path="tips" element={<Navigate to="/#/tips" replace />} />
        <Route path="blog" element={<Navigate to="/#/blog" replace />} />
        <Route
          path="blog/:postName/:index"
          element={<Navigate to="/#/blog/:postName/:index" replace />}
        />
        <Route
          path="blog/:country"
          element={<Navigate to="/#/blog/:country" replace />}
        />

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

function BlogPost() {
  const { postName, index } = useParams();

  switch (postName) {
    case "trinidad-tobego-post":
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

  const originalCountry = blogs.find(
    (blog) => serializeLocation(blog.country) === country,
  )?.country;

  if (!originalCountry) {
    return <ErrorPage />;
  }

  return <BlogSection country={originalCountry} />;
}

export default App;
