import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Link } from "react-router-dom";
import { Eye, Heart } from "lucide-react";

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Only fetch published posts
    supabase
      .from("posts")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => setPosts(data || []));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
      {posts.map((post) => (
        <Link
          key={post.id}
          to={`/post/${post.slug}`}
          className="bg-white border rounded-xl overflow-hidden hover:shadow-lg transition"
        >
          <div className="h-48 bg-gray-200">
            {post.image_url && (
              <img
                src={post.image_url}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="p-5">
            <h2 className="font-bold text-xl mb-2">{post.title}</h2>
            <div className="flex gap-4 text-gray-400 text-sm">
              <span className="flex items-center gap-1">
                <Eye size={14} /> {post.views_count}
              </span>
              <span className="flex items-center gap-1">
                <Heart size={14} /> {post.likes_count}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
