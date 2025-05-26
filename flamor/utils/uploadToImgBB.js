import axios from "axios";
import FormData from "form-data";
import fs from "fs";

export const uploadToImgBB = async (filePath) => {
  try {
    const imageFile = fs.readFileSync(filePath);
    const form = new FormData();
    form.append("image", imageFile.toString("base64"));

    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
      form,
      { headers: form.getHeaders() }
    );

    // Optionally delete temp file after upload
    fs.unlink(filePath, (err) => {
      if (err) console.warn("Failed to delete temp image file:", err);
    });

    return response.data.data.url; // hosted image URL
  } catch (err) {
    console.error("ImgBB upload failed:", err.response?.data || err.message || err);
    throw new Error("Image upload failed");
  }
};
