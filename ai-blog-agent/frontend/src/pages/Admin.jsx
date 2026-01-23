import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import {
  LayoutDashboard,
  LogOut,
  Save,
  X,
  Image,
  User,
  Eye,
  Heart,
  Trash2,
  Edit3,
  Search,
  DollarSign,
  Link as LinkIcon,
  Plus, // <-- NEW: Imported Plus icon
} from "lucide-react";

export default function Admin() {
  const [session, setSession] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null);

  // Login States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = [
    "World",
    "Sports",
    "Technology",
    "Business",
    "Entertainment",
    "Health",
  ];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchPosts();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchPosts();
    });

    return () => subscription.unsubscribe();
  }, []);

  async function fetchPosts() {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setPosts(data);
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setError(error.message);
    else fetchPosts();
    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    setSession(null);
    setPosts([]);
  }

  // --- NEW: Function to start a fresh post ---
  function handleCreateNew() {
    setEditing({
      title: "",
      content: "",
      category: "Technology",
      author: "Admin",
      image_url: "",
      is_published: false,
      views_count: 0,
      likes_count: 0,
      ad_image: "",
      ad_link: "",
    });
  }

  async function handleSave() {
    if (!editing.title || !editing.content) {
      alert("Title and Content are required!");
      return;
    }

    try {
      // 1. CREATE NEW POST
      if (!editing.id) {
        // Generate a URL slug from the title (e.g., "My News" -> "my-news")
        const slug = editing.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");

        const { error } = await supabase.from("posts").insert([
          {
            title: editing.title,
            slug: slug,
            content: editing.content,
            is_published: editing.is_published,
            image_url: editing.image_url,
            category: editing.category,
            author: editing.author,
            views_count: parseInt(editing.views_count || 0),
            likes_count: parseInt(editing.likes_count || 0),
            ad_image: editing.ad_image,
            ad_link: editing.ad_link,
          },
        ]);

        if (error) throw error;
      }
      // 2. UPDATE EXISTING POST
      else {
        const { error } = await supabase
          .from("posts")
          .update({
            title: editing.title,
            content: editing.content,
            is_published: editing.is_published,
            image_url: editing.image_url,
            category: editing.category,
            author: editing.author,
            views_count: parseInt(editing.views_count || 0),
            likes_count: parseInt(editing.likes_count || 0),
            ad_image: editing.ad_image,
            ad_link: editing.ad_link,
          })
          .eq("id", editing.id);

        if (error) throw error;
      }

      setEditing(null);
      fetchPosts();
    } catch (error) {
      alert("Error saving: " + error.message);
    }
  }

  // --- LOGIN SCREEN ---
  if (!session)
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        <form
          onSubmit={handleLogin}
          className="bg-gray-900 p-8 rounded-2xl border border-gray-800 shadow-2xl w-96"
        >
          <div className="flex justify-center mb-6">
            <LayoutDashboard size={40} className="text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold mb-6 text-center tracking-wider">
            ADMIN ACCESS
          </h1>
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 mb-4 rounded text-sm text-center">
              {error}
            </div>
          )}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 p-3 rounded-lg mb-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 p-3 rounded-lg mb-6 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <button
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-lg font-bold transition-all shadow-lg shadow-blue-900/20"
          >
            {loading ? "Authenticating..." : "Enter Dashboard"}
          </button>
        </form>
      </div>
    );

  // --- EDITOR SCREEN ---
  if (editing)
    return (
      <div className="min-h-screen bg-black text-gray-300 p-6 flex justify-center">
        <div className="w-full max-w-6xl bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl overflow-hidden flex flex-col h-[90vh]">
          {/* Toolbar */}
          <div className="p-4 border-b border-gray-800 bg-gray-900 flex gap-4 items-center justify-between">
            <div className="flex items-center gap-2 text-white font-bold">
              {editing.id ? (
                <>
                  <Edit3 size={18} className="text-blue-500" />
                  <span>Editing Post</span>
                </>
              ) : (
                <>
                  <Plus size={18} className="text-green-500" />
                  <span>Creating New Post</span>
                </>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg font-bold transition"
              >
                <Save size={16} /> {editing.id ? "Save Changes" : "Publish Now"}
              </button>
              <button
                onClick={() => setEditing(null)}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-5 py-2 rounded-lg font-medium transition"
              >
                <X size={16} /> Cancel
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Title & Publish */}
            <div className="flex gap-4">
              <input
                value={editing.title}
                onChange={(e) =>
                  setEditing({ ...editing, title: e.target.value })
                }
                className="flex-1 bg-gray-800 border border-gray-700 p-4 rounded-xl text-xl font-bold text-white focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-500"
                placeholder="Enter Post Headline..."
              />
              <label
                className={`flex items-center gap-3 px-6 rounded-xl border cursor-pointer select-none transition ${
                  editing.is_published
                    ? "bg-green-900/30 border-green-600/50"
                    : "bg-gray-800 border-gray-700"
                }`}
              >
                <input
                  type="checkbox"
                  checked={editing.is_published}
                  onChange={(e) =>
                    setEditing({ ...editing, is_published: e.target.checked })
                  }
                  className="w-5 h-5 accent-green-500"
                />
                <span
                  className={`font-bold ${
                    editing.is_published ? "text-green-400" : "text-gray-400"
                  }`}
                >
                  {editing.is_published ? "PUBLISHED" : "DRAFT"}
                </span>
              </label>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Topic
                </label>
                <select
                  value={editing.category || "Technology"}
                  onChange={(e) =>
                    setEditing({ ...editing, category: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-lg outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                  <User size={12} /> Author
                </label>
                <input
                  placeholder="Admin"
                  value={editing.author || "Admin"}
                  onChange={(e) =>
                    setEditing({ ...editing, author: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-lg outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                  <Eye size={12} /> Views
                </label>
                <input
                  type="number"
                  value={editing.views_count}
                  onChange={(e) =>
                    setEditing({ ...editing, views_count: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-lg outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                  <Heart size={12} /> Likes
                </label>
                <input
                  type="number"
                  value={editing.likes_count}
                  onChange={(e) =>
                    setEditing({ ...editing, likes_count: e.target.value })
                  }
                  className="w-full bg-gray-800 border border-gray-700 text-white p-3 rounded-lg outline-none"
                />
              </div>
            </div>

            {/* MONETIZATION SECTION */}
            <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
              <div className="flex items-center gap-2 mb-3 text-yellow-500 font-bold text-sm uppercase tracking-wider">
                <DollarSign size={16} /> Monetization / Ads
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1 mb-1">
                    <Image size={12} /> Ad Image URL
                  </label>
                  <input
                    placeholder="https://image-for-ad.jpg"
                    value={editing.ad_image || ""}
                    onChange={(e) =>
                      setEditing({ ...editing, ad_image: e.target.value })
                    }
                    className="w-full bg-gray-800 border border-gray-700 text-gray-300 p-3 rounded-lg focus:ring-1 focus:ring-yellow-500 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1 mb-1">
                    <LinkIcon size={12} /> Ad Target Link
                  </label>
                  <input
                    placeholder="https://amazon.com/product..."
                    value={editing.ad_link || ""}
                    onChange={(e) =>
                      setEditing({ ...editing, ad_link: e.target.value })
                    }
                    className="w-full bg-gray-800 border border-gray-700 text-gray-300 p-3 rounded-lg focus:ring-1 focus:ring-yellow-500 outline-none text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Image size={12} /> Cover Image URL
              </label>
              <input
                placeholder="https://..."
                value={editing.image_url || ""}
                onChange={(e) =>
                  setEditing({ ...editing, image_url: e.target.value })
                }
                className="w-full bg-gray-800 border border-gray-700 text-gray-400 p-3 rounded-lg focus:text-white focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
              />
            </div>

            {/* Main Content */}
            <div className="space-y-2 h-full flex flex-col">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Article Content
              </label>
              <textarea
                value={editing.content}
                onChange={(e) =>
                  setEditing({ ...editing, content: e.target.value })
                }
                className="w-full flex-1 min-h-[300px] bg-gray-800 border border-gray-700 text-gray-300 p-6 rounded-xl font-mono text-sm leading-relaxed resize-y focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="# Start writing..."
              />
            </div>
          </div>
        </div>
      </div>
    );

  // --- DASHBOARD LIST ---
  return (
    <div className="min-h-screen bg-black text-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white mb-1">
              DASHBOARD
            </h1>
            <p className="text-gray-500 text-sm">
              Manage your content and analytics
            </p>
          </div>
          <div className="flex gap-4">
            {/* --- NEW: Create Post Button --- */}
            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-lg transition shadow-lg shadow-blue-900/20"
            >
              <Plus size={16} /> New Post
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gray-900 hover:bg-red-900/30 text-gray-400 hover:text-red-400 border border-gray-800 px-4 py-2 rounded-lg transition"
            >
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        </div>
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden shadow-2xl">
          {posts.length === 0 ? (
            <div className="p-20 text-center">
              <p className="text-gray-500">No posts found.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              <div className="grid grid-cols-12 px-6 py-3 bg-gray-950/50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <div className="col-span-6">Article</div>
                <div className="col-span-2">Author</div>
                <div className="col-span-2 text-center">Stats</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="grid grid-cols-12 px-6 py-4 items-center hover:bg-gray-800/50 transition group"
                >
                  <div className="col-span-6 pr-4">
                    <h3 className="font-bold text-white text-lg truncate mb-1">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          post.is_published
                            ? "bg-green-900/30 text-green-400"
                            : "bg-yellow-900/30 text-yellow-500"
                        }`}
                      >
                        {post.is_published ? "Live" : "Draft"}
                      </span>
                      <span className="text-xs text-gray-500 px-2 border-l border-gray-700">
                        {post.category || "Uncategorized"}
                      </span>
                    </div>
                  </div>
                  <div className="col-span-2 text-sm text-gray-400 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-white">
                      {(post.author || "A")[0]}
                    </div>
                    {post.author || "Admin"}
                  </div>
                  <div className="col-span-2 flex justify-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Eye size={14} /> {post.views_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart size={14} /> {post.likes_count}
                    </span>
                  </div>
                  <div className="col-span-2 flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button
                      onClick={() => setEditing(post)}
                      className="p-2 bg-blue-900/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg transition"
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm("Are you sure?")) {
                          await supabase
                            .from("posts")
                            .delete()
                            .eq("id", post.id);
                          fetchPosts();
                        }
                      }}
                      className="p-2 bg-red-900/20 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
