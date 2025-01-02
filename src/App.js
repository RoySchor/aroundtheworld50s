import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import HomePage from "./pages/HomePage/HomePage";
import AboutMePage from "./pages/AboutMePage/AboutMePage";
import DestinationsPage from "./pages/DestinationsPage/DestinationsPage";
import BlogPage from "./pages/BlogPage";
import SpecialsPage from "./pages/SpecialsPage";
import TipsPage from "./pages/TipsPage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutMePage />} />
        <Route path="/destinations" element={<DestinationsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/special-pop-ups" element={<SpecialsPage />} />
        <Route path="/tips" element={<TipsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
