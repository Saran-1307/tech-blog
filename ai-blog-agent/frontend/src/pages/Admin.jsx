import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import MdEditor from "react-markdown-editor-lite";
import MarkdownIt from "markdown-it";
import "react-markdown-editor-lite/lib/index.css";

const mdParser = new MarkdownIt();

export default function Admin() {
  const [session, setSession] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => setSession(session));
    fetchPosts();
  }, [session]); // Refresh when session changes

  async function fetchPosts() {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setPosts(data);
  }

  async function handleImageUpload(file) {
    const fileName = `${Date.now()}_${file.name}`;
    await supabase.storage.from("images").upload(fileName, file);
    return supabase.storage.from("images").getPublicUrl(fileName).data
      .publicUrl;
  }

  async function handleSave() {
    await supabase
      .from("posts")
      .update({
        title: editing.title,
        content: editing.content,
        is_published: editing.is_published,
        image_url: editing.image_url,
      })
      .eq("id", editing.id);
    setEditing(null);
    fetchPosts();
  }

  if (!session)
    return (
      <button
        onClick={() => supabase.auth.signInWithOAuth({ provider: "google" })}
        className="m-10 bg-blue-600 text-white p-3 rounded"
      >
        Login Admin
      </button>
    );

  if (editing)
    return (
      <div className="h-screen flex flex-col p-4 bg-white">
        <div className="flex gap-4 mb-4">
          <input
            value={editing.title}
            onChange={(e) => setEditing({ ...editing, title: e.target.value })}
            className="border p-2 flex-1 font-bold"
          />
          <input
            placeholder="Image URL"
            value={editing.image_url || ""}
            onChange={(e) =>
              setEditing({ ...editing, image_url: e.target.value })
            }
            className="border p-2"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={editing.is_published}
              onChange={(e) =>
                setEditing({ ...editing, is_published: e.target.checked })
              }
            />{" "}
            Publish
          </label>
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 rounded"
          >
            Save
          </button>
        </div>
        <MdEditor
          style={{ height: "100%" }}
          renderHTML={(text) => mdParser.render(text)}
          value={editing.content}
          onChange={({ text }) => setEditing({ ...editing, content: text })}
          onImageUpload={handleImageUpload}
        />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      {posts.map((post) => (
        <div key={post.id} className="flex justify-between border-b p-4">
          <div>
            <div className="font-bold">{post.title}</div>
            <div
              className={`text-xs ${
                post.is_published ? "text-green-600" : "text-orange-500"
              }`}
            >
              {post.is_published ? "LIVE" : "DRAFT"}
            </div>
          </div>
          <div className="gap-2 flex">
            <button onClick={() => setEditing(post)} className="text-blue-600">
              Edit
            </button>
            <button
              onClick={async () => {
                if (confirm("Delete?")) {
                  await supabase.from("posts").delete().eq("id", post.id);
                  fetchPosts();
                }
              }}
              className="text-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
