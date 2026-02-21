import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import {
  Heart,
  Eye,
  ArrowLeft,
  Calendar,
  User,
  Sun,
  Moon,
  Minus,
  Plus,
  Type,
} from "lucide-react";

export default function Post() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasLiked, setHasLiked] = useState(false);
  const [textSize, setTextSize] = useState(18);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  // 1. Fetch Post Data
  useEffect(() => {
    async function fetchAndIncrementView() {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        setLoading(false);
        return;
      }
      setPost(data);
      setLoading(false);
      await supabase
        .from("posts")
        .update({ views_count: (data.views_count || 0) + 1 })
        .eq("id", data.id);
    }
    fetchAndIncrementView();
  }, [slug]);

  // 2. Initialize AdSense AFTER the post loads
  useEffect(() => {
    if (!loading && post) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense error:", e);
      }
    }
  }, [loading, post]);

  const handleLike = async () => {
    if (hasLiked) return;
    setPost((prev) => ({ ...prev, likes_count: (prev.likes_count || 0) + 1 }));
    setHasLiked(true);
    await supabase
      .from("posts")
      .update({ likes_count: (post.likes_count || 0) + 1 })
      .eq("id", post.id);
  };

  const increaseText = () => {
    if (textSize < 32) setTextSize(textSize + 2);
  };
  const decreaseText = () => {
    if (textSize > 14) setTextSize(textSize - 2);
  };

  if (loading)
    return (
      <div
        className={`flex items-center justify-center h-screen ${isDarkMode ? "bg-black" : "bg-gray-50"}`}
      >
        <div
          className={`animate-spin rounded-full h-12 w-12 border-b-2 ${isDarkMode ? "border-white" : "border-black"}`}
        ></div>
      </div>
    );

  if (!post) return <div className="p-10 text-center">Post not found.</div>;

  return (
    <div
      className={`min-h-screen pb-32 transition-colors duration-300 ${isDarkMode ? "bg-black text-gray-100" : "bg-white text-gray-900"}`}
    >
      {/* NAVBAR */}
      <nav
        className={`fixed top-0 w-full z-50 backdrop-blur-md border-b transition-colors duration-300 ${isDarkMode ? "bg-black/70 border-gray-800" : "bg-white/70 border-white/20"}`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            to="/"
            className={`p-2 -ml-2 rounded-full transition ${isDarkMode ? "hover:bg-gray-800 text-gray-300" : "hover:bg-black/5 text-gray-700"}`}
          >
            <ArrowLeft size={24} />
          </Link>
          <div className="font-bold text-sm tracking-widest uppercase opacity-50 hidden md:block">
            Daily Scope
          </div>
          <div className="flex items-center gap-2">
            <div
              className={`flex items-center mr-2 rounded-full px-2 py-1 ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}
            >
              <button
                onClick={decreaseText}
                className="p-1 hover:opacity-70 transition"
              >
                <Minus size={14} />
              </button>
              <Type size={16} className="mx-2 opacity-50" />
              <button
                onClick={increaseText}
                className="p-1 hover:opacity-70 transition"
              >
                <Plus size={14} />
              </button>
            </div>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition ${isDarkMode ? "hover:bg-gray-800 text-yellow-400" : "hover:bg-gray-100 text-gray-700"}`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* PAGE CONTAINER - Changed breakpoints from lg to md, and adjusted column sizes */}
      <div className="mx-auto px-6 pt-28 max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
        {/* MAIN CONTENT - Takes up 9 out of 12 columns on PC */}
        <div className="md:col-span-8 lg:col-span-9">
          <div className="mb-6">
            <div className="flex gap-4 text-xs font-bold opacity-60 uppercase tracking-wider mb-3">
              <span className="flex items-center gap-1">
                <Calendar size={12} />{" "}
                {new Date(post.created_at).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1 text-blue-500">
                <User size={12} /> {post.author || "Admin"}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black leading-tight mb-4">
              {post.title}
            </h1>
          </div>

          <div
            className={`w-full aspect-video rounded-2xl overflow-hidden shadow-xl mb-10 ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}
          >
            <img
              src={
                post.image_url ||
                "https://images.unsplash.com/photo-1550751827-4bd374c3f58b"
              }
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div
            style={{ fontSize: `${textSize}px`, lineHeight: "1.8" }}
            className={`prose max-w-none transition-all duration-300 font-serif whitespace-pre-wrap ${isDarkMode ? "prose-invert text-gray-300" : "text-gray-700"}`}
          >
            {post.content}
          </div>
        </div>

        {/* GOOGLE ADSENSE SIDEBAR - Takes up 3 out of 12 columns on PC (Small right portion) */}
        <div className="md:col-span-4 lg:col-span-3 mt-10 md:mt-0">
          <div
            className={`sticky top-24 rounded-2xl overflow-hidden shadow-lg border p-4 flex flex-col items-center justify-center min-h-[300px] ${isDarkMode ? "bg-gray-900 border-gray-800" : "bg-gray-50 border-gray-200"}`}
          >
            <div className="text-xs font-bold opacity-40 uppercase tracking-widest mb-4">
              Advertisement
            </div>

            {/* The Ad Container */}
            <div className="w-full overflow-hidden flex justify-center">
              <ins
                className="adsbygoogle"
                style={{ display: "block", width: "100%" }}
                data-ad-client="ca-pub-2433053692740067" // Your publisher ID
                data-ad-slot="" // You will fill this in after approval!
                data-ad-format="auto"
                data-full-width-responsive="true"
              ></ins>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div
        className={`fixed bottom-0 w-full py-4 px-6 z-40 shadow-2xl border-t transition-colors duration-300 ${isDarkMode ? "bg-gray-900 border-gray-800 text-white" : "bg-black border-gray-900 text-white"}`}
      >
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={handleLike}
            disabled={hasLiked}
            className={`flex items-center gap-3 px-6 py-2 rounded-full transition-all active:scale-95 ${hasLiked ? "bg-red-600 text-white" : isDarkMode ? "bg-black hover:bg-gray-800" : "bg-gray-800 hover:bg-gray-700"}`}
          >
            <Heart size={20} fill={hasLiked ? "currentColor" : "none"} />
            <span className="font-bold">{post.likes_count} Likes</span>
          </button>
          <div className="flex items-center gap-2 opacity-70 font-medium">
            <Eye size={20} />
            <span>{post.views_count} Views</span>
          </div>
        </div>
      </div>
    </div>
  );
}
