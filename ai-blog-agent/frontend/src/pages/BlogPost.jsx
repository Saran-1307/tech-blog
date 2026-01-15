import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import ReactMarkdown from "react-markdown";
import { Heart } from "lucide-react";

const AdUnit = () => (
  <div className="my-8 p-4 bg-gray-100 border border-dashed text-center text-gray-400">
    [[ ADVERTISEMENT ]]
  </div>
);

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .single()
      .then(({ data }) => {
        setPost(data);
        if (data) supabase.rpc("increment_views", { row_id: data.id });
      });
  }, [slug]);

  if (!post) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-extrabold mb-6">{post.title}</h1>
      {post.image_url && (
        <img
          src={post.image_url}
          className="w-full h-80 object-cover rounded-xl mb-8"
        />
      )}

      <div className="prose lg:prose-xl">
        {post.content.split("[[AD]]").map((part, i) => (
          <div key={i}>
            <ReactMarkdown>{part}</ReactMarkdown>
            {i < post.content.split("[[AD]]").length - 1 && <AdUnit />}
          </div>
        ))}
      </div>

      <button
        onClick={() => supabase.rpc("increment_likes", { row_id: post.id })}
        className="mt-8 flex gap-2 items-center font-bold text-red-500"
      >
        <Heart /> Like
      </button>
    </div>
  );
}
