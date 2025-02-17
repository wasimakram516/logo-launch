export const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);
  
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
  
    const data = await res.json();
    if (!data.success) {
      console.error("Image upload failed:", data.message);
    }
    return data;
  };
  