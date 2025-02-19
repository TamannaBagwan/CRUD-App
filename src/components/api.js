import axios from "axios";

const API_URL = "https://jsonplaceholder.typicode.com/posts"; 

export const fetchPosts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const addPost = async (post) => {
  const response = await axios.post(API_URL, post);
  return response.data;
};

export const updatePost = async (id, postData) => {
  console.log("Updating Post:", { id, postData });

  try {
    const response = await axios.patch(`${API_URL}/${id}`, postData, {
      headers: { "Content-Type": "application/json" },
    });

    console.log("Update Response:", response.data);
    return { ...postData, id }; 
  } catch (error) {
    console.error(
      "Error updating post:",
      error.response?.data || error.message
    );
    alert("Failed to update post. Check the console for details.");
    throw error;
  }
};

export const deletePost = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};
