import React, { useEffect, useState } from "react";
import { fetchPosts, addPost, updatePost, deletePost } from "./api";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", body: "" });
  const [editingPost, setEditingPost] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchPosts()
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingPost) {
      if (!editingPost.id) {
        console.error("Missing Post ID:", editingPost);
        alert("Error: Missing Post ID");
        return;
      }

      try {
        const updated = await updatePost(editingPost.id, newPost);
        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p.id === editingPost.id ? { ...p, ...updated } : p
          )
        );

        setEditingPost(null);
        setNewPost({ title: "", body: "" });
      } catch (error) {
        console.error("Failed to update post:", error);
      }
    } else {
      try {
        const added = await addPost(newPost);
        setPosts((prevPosts) => [...prevPosts, added]);
        setNewPost({ title: "", body: "" });
      } catch (error) {
        console.error("Failed to add post:", error);
      }
    }
  };

  const handleDelete = async (id) => {
    await deletePost(id);
    setPosts(posts.filter((p) => p.id !== id));
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setNewPost({ title: post.title, body: post.body });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-start lg:items-center">
      <div className="w-full lg:max-w-2xl">
        <h1 className="text-3xl font-extrabold text-center text-white bg-gradient-to-r from-blue-500 to-purple-500 py-3 rounded-lg shadow-md">
          CRUD App
        </h1>

        {loading && (
          <div className="flex justify-center my-4">
            <div className="w-8 h-8 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
          </div>
        )}

        <div className="mb-6 w-full">
          <h2 className="text-2xl font-semibold text-gray-800 py-2">
            {editingPost ? "Edit Post" : "Add New Post"}
          </h2>

          <input
            type="text"
            placeholder="Title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            className="border p-2 rounded w-full mb-3"
          />
          <textarea
            placeholder="Body"
            value={newPost.body}
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
            className="border p-2 rounded w-full mb-3"
          ></textarea>
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white py-2 px-4 rounded transition duration-300 hover:bg-green-600"
          >
            {editingPost ? "Update Post" : "Add Post"}
          </button>
        </div>

        <div className="w-full">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white p-4 rounded-lg shadow mb-4 border"
            >
              <h2 className="text-lg font-bold">{post.title}</h2>
              <p className="text-gray-700">{post.body}</p>
              <div className="mt-3">
                <button
                  onClick={() => handleEdit(post)}
                  className="bg-yellow-500 text-white py-1 px-3 rounded mr-2 transition duration-300 hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="bg-red-500 text-white py-1 px-3 rounded transition duration-300 hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Posts;
