import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
} from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import HomePage from "./pages/HomePage/HomePage";
import AboutMePage from "./pages/AboutMePage/AboutMePage";
import DestinationsPage from "./pages/DestinationsPage/DestinationsPage";
import BlogPage from "./pages/BlogPage/BlogPage";
import SpecialsPage from "./pages/SpecialsPage";
import TipsPage from "./pages/TipsPage";
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

export default App;
