import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BlogPost from "./pages/BlogPost";
import Admin from "./pages/Admin";
import CompanyInfo from "./pages/CompanyInfo";
import Footer from "./pages/Footer";
export default function App() {
  // Optional: If you want the footer to strictly follow the system/local theme,
  // you can pull the isDarkMode state up here, or just let it default to a dark/light footer.
  // Assuming a standard light default for the wrapper if not managed globally:

  return (
    <BrowserRouter>
      {/* We use flex and min-h-screen to push the footer to the bottom */}
      <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 font-sans">
        {/* Main Content Area grows to push footer down */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/post/:slug" element={<BlogPost />} />
            <Route path="/admin" element={<Admin />} />

            <Route path="/about" element={<CompanyInfo initialTab="about" />} />
            <Route
              path="/contact"
              element={<CompanyInfo initialTab="contact" />}
            />
            <Route
              path="/privacy"
              element={<CompanyInfo initialTab="privacy" />}
            />
            <Route path="/terms" element={<CompanyInfo initialTab="terms" />} />
          </Routes>
        </div>

        {/* 👇 The Footer sits at the very bottom of every page */}
        <Footer isDarkMode={false} />
      </div>
    </BrowserRouter>
  );
}
