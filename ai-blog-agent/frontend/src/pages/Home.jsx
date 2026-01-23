import { useEffect, useState, useRef } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";
import {
  Eye,
  Sun,
  Moon,
  Zap,
  Globe,
  Laptop,
  Briefcase,
  Film,
  Activity,
  MoreVertical,
  X,
  Minus,
  LayoutGrid,
} from "lucide-react";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // --- MENU STATES ---
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dragY, setDragY] = useState(0);
  const sheetRef = useRef(null);

  // --- THEME STATES ---
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await supabase
        .from("posts")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      setPosts(data || []);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const filteredPosts =
    selectedCategory === "All"
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  const trendingPosts = posts.slice(0, 4);

  const categories = [
    {
      name: "World",
      icon: <Globe size={28} />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      name: "Sports",
      icon: <Zap size={28} />,
      color: "bg-orange-100 text-orange-600",
    },
    {
      name: "Technology",
      icon: <Laptop size={28} />,
      color: "bg-gray-100 text-gray-600",
    },
    {
      name: "Business",
      icon: <Briefcase size={28} />,
      color: "bg-green-100 text-green-600",
    },
    {
      name: "Entertainment",
      icon: <Film size={28} />,
      color: "bg-purple-100 text-purple-600",
    },
    {
      name: "Health",
      icon: <Activity size={28} />,
      color: "bg-red-100 text-red-600",
    },
  ];

  // --- MOBILE DRAG LOGIC ---
  const handleTouchStart = (e) => (sheetRef.current = e.touches[0].clientY);
  const handleTouchMove = (e) => {
    const deltaY = e.touches[0].clientY - sheetRef.current;
    if (deltaY > 0) setDragY(deltaY);
  };
  const handleTouchEnd = () => {
    if (dragY > 100) setIsMenuOpen(false);
    setDragY(0);
  };

  const selectTopic = (catName) => {
    setSelectedCategory(catName);
    setIsMenuOpen(false);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 pb-20 ${
        isDarkMode ? "bg-black text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* --- NAVBAR --- */}
      <nav
        className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-300 ${
          isDarkMode
            ? "bg-black/80 border-gray-800"
            : "bg-white/80 border-gray-100"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div
            className="font-black text-2xl tracking-tighter flex items-center gap-2 cursor-pointer select-none"
            onClick={() => setSelectedCategory("All")}
          >
            <span
              className={`px-2 py-1 rounded ${
                isDarkMode ? "bg-white text-black" : "bg-black text-white"
              }`}
            >
              TECH
            </span>
            <span>BLOG</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition ${
                isDarkMode
                  ? "hover:bg-gray-800 text-yellow-400"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
            >
              {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
            </button>

            {/* MENU TRIGGER */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 rounded-full transition ${
                isDarkMode
                  ? "hover:bg-gray-800 text-white"
                  : "hover:bg-gray-100 text-black"
              }`}
            >
              {isMenuOpen ? <X size={24} /> : <MoreVertical size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* =========================================
          DESKTOP MENU (Fortnite Emote-Wheel Style)
          ========================================= */}
      <div
        className={`hidden md:flex fixed inset-0 z-50 items-center justify-center transition-all duration-300 ${
          isMenuOpen
            ? "opacity-100 visible backdrop-blur-lg bg-black/40"
            : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={() => setIsMenuOpen(false)} // Close if clicked outside
      >
        <div
          onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside the box
          className={`relative max-w-xl w-full p-10 rounded-[40px] shadow-2xl transition-all duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] border ${
            isMenuOpen ? "scale-100 opacity-100" : "scale-50 opacity-0"
          } ${
            isDarkMode
              ? "bg-gray-900 border-gray-800"
              : "bg-white border-gray-100"
          }`}
        >
          {/* Close Button Inside Menu */}
          <button
            onClick={() => setIsMenuOpen(false)}
            className={`absolute top-6 right-6 p-2 rounded-full transition active:scale-90 ${
              isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
            }`}
          >
            <X size={24} />
          </button>

          <h3 className="text-center font-black text-2xl uppercase tracking-widest mb-8 opacity-50">
            Select Module
          </h3>

          <div className="grid grid-cols-3 gap-6">
            <button
              onClick={() => selectTopic("All")}
              className={`flex flex-col items-center justify-center p-6 rounded-3xl font-bold transition-all hover:scale-105 active:scale-95 shadow-md ${
                selectedCategory === "All"
                  ? isDarkMode
                    ? "bg-white text-black"
                    : "bg-black text-white"
                  : isDarkMode
                  ? "bg-gray-800 hover:bg-gray-700"
                  : "bg-gray-50 hover:bg-white"
              }`}
            >
              <LayoutGrid size={28} className="mb-2" />
              ALL
            </button>
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => selectTopic(cat.name)}
                className={`flex flex-col items-center justify-center p-6 rounded-3xl font-bold uppercase tracking-wider text-sm transition-all hover:scale-105 active:scale-95 shadow-md ${
                  selectedCategory === cat.name
                    ? isDarkMode
                      ? "bg-white text-black"
                      : "bg-black text-white"
                    : isDarkMode
                    ? "bg-gray-800 hover:bg-gray-700 text-gray-300"
                    : "bg-gray-50 hover:bg-white text-gray-700"
                }`}
              >
                <span
                  className={`mb-2 ${
                    selectedCategory === cat.name ? "" : cat.color.split(" ")[1]
                  }`}
                >
                  {cat.icon}
                </span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================
          MOBILE MENU (Draggable Bottom Sheet)
          ========================================= */}
      <div
        className={`md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsMenuOpen(false)}
      />
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: isMenuOpen ? `translateY(${dragY}px)` : "translateY(100%)",
        }}
        className={`md:hidden fixed bottom-0 left-0 w-full rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] pb-8 z-50 transition-transform duration-300 ease-in-out ${
          isDarkMode ? "bg-gray-900" : "bg-white"
        }`}
      >
        <div className="flex justify-center pt-3 pb-1">
          <Minus size={36} className="text-gray-400 opacity-50" />
        </div>
        <div className="px-6 pt-2 pb-2 flex justify-between items-center">
          <h3 className="font-bold text-lg uppercase tracking-wider">
            Browse Topics
          </h3>
          <span className="text-xs font-bold text-gray-500">Swipe down</span>
        </div>
        <div className="grid grid-cols-2 gap-3 px-6 pb-2">
          <button
            onClick={() => selectTopic("All")}
            className={`flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${
              selectedCategory === "All"
                ? isDarkMode
                  ? "bg-white text-black"
                  : "bg-black text-white"
                : isDarkMode
                ? "bg-gray-800"
                : "bg-gray-50"
            }`}
          >
            🔥 All News
          </button>
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => selectTopic(cat.name)}
              className={`flex items-center gap-3 p-3 rounded-xl font-bold transition-all ${
                selectedCategory === cat.name
                  ? isDarkMode
                    ? "bg-white text-black"
                    : "bg-black text-white"
                  : isDarkMode
                  ? "bg-gray-800 text-gray-300"
                  : "bg-gray-50 text-gray-700"
              }`}
            >
              <span className={cat.color.split(" ")[1]}>
                {/* Kept smaller icons for mobile */} {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div
        className={`max-w-6xl mx-auto px-6 pt-10 transition-all duration-300 ${
          isMenuOpen ? "blur-sm opacity-50 pointer-events-none" : ""
        }`}
      >
        {/* TRENDING SECTION */}
        {selectedCategory === "All" && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="w-1 h-6 bg-red-500 rounded-full"></span>
                TRENDING NOW
              </h2>
              <span className="text-xs font-bold opacity-60 uppercase tracking-wider">
                Swipe →
              </span>
            </div>

            <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar">
              {loading
                ? [1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`min-w-[280px] h-[350px] rounded-2xl animate-pulse ${
                        isDarkMode ? "bg-gray-800" : "bg-gray-200"
                      }`}
                    />
                  ))
                : trendingPosts.map((post) => (
                    <Link
                      key={post.id}
                      to={`/post/${post.slug}`}
                      className={`snap-center min-w-[300px] md:min-w-[350px] group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                        isDarkMode
                          ? "bg-gray-900 border border-gray-800"
                          : "bg-white"
                      }`}
                    >
                      <div className="h-48 overflow-hidden">
                        <img
                          src={
                            post.image_url ||
                            "https://images.unsplash.com/photo-1504711434969-e33886168f5c"
                          }
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                        />
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-3 text-xs opacity-60 mb-3">
                          <span
                            className={`px-2 py-1 rounded-md font-bold text-[10px] uppercase ${
                              isDarkMode
                                ? "bg-white text-black"
                                : "bg-black text-white"
                            }`}
                          >
                            {post.category || "NEWS"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye size={12} /> {post.views_count}
                          </span>
                        </div>
                        <h3
                          className={`font-bold text-lg leading-tight mb-2 line-clamp-2 transition ${
                            isDarkMode
                              ? "group-hover:text-blue-400"
                              : "group-hover:text-blue-600"
                          }`}
                        >
                          {post.title}
                        </h3>
                      </div>
                    </Link>
                  ))}
            </div>
          </div>
        )}

        {/* FILTERED NEWS LIST */}
        <div className="min-h-[300px]">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 uppercase">
            <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
            {selectedCategory === "All"
              ? "Latest Stories"
              : `${selectedCategory} News`}
          </h2>

          {filteredPosts.length === 0 ? (
            <div
              className={`text-center py-20 rounded-xl border border-dashed ${
                isDarkMode
                  ? "bg-gray-900 border-gray-700"
                  : "bg-white border-gray-300"
              }`}
            >
              <p className="opacity-60 font-medium mb-4">
                No news found for {selectedCategory}.
              </p>
              <button
                onClick={() => setSelectedCategory("All")}
                className={`px-6 py-2 rounded-full text-sm font-bold transition ${
                  isDarkMode
                    ? "bg-white text-black hover:bg-gray-200"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                View All News
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/post/${post.slug}`}
                  className={`flex rounded-xl overflow-hidden border hover:shadow-lg transition-all group ${
                    isDarkMode
                      ? "bg-gray-900 border-gray-800 hover:border-gray-600"
                      : "bg-white border-gray-100"
                  }`}
                >
                  <div className="w-1/3 overflow-hidden">
                    <img
                      src={
                        post.image_url ||
                        "https://images.unsplash.com/photo-1504711434969-e33886168f5c"
                      }
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>
                  <div className="w-2/3 p-4 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-60 mb-1 flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            categories
                              .find((c) => c.name === post.category)
                              ?.color.split(" ")[1]
                              .replace("text", "bg") || "bg-gray-400"
                          }`}
                        ></span>
                        {post.category || "General"}
                      </span>
                      <h3 className="font-bold text-base md:text-lg mb-2 line-clamp-2">
                        {post.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
