import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import BlogPost from "./pages/BlogPost";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <nav className="bg-white border-b px-6 py-4 flex justify-between sticky top-0 z-50">
          <Link to="/" className="text-2xl font-black">
            AI<span className="text-blue-600">NEWS</span>.
          </Link>
          <Link to="/admin" className="font-bold text-gray-500">
            Admin
          </Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:slug" element={<BlogPost />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
