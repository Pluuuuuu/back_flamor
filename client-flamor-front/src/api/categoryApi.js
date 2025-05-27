import axios from "axios";

export const fetchCategories = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/categories", {
      withCredentials: true,
    });

    // Fix here: use correct property name
    return res.data
      .map(({ name, background_image_url }) => ({
        name,
        image: background_image_url, // alias it to `image` for consistent use
      }))
      .slice(0, 5); // Limit to 5 categories
  } catch (err) {
    console.error("Error fetching categories:", err);
    return [];
  }
};
