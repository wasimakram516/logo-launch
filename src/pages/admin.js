import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Select,
  MenuItem,
  TextField,
  Box,
} from "@mui/material";
import { fetchLogos, addLogo, updateLogo, deleteLogo } from "@/lib/logoService";
import { uploadImage } from "@/lib/uploadService";

const AdminPage = () => {
  const router = useRouter();
  const [logos, setLogos] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    image: null,
  });
  const [editingLogo, setEditingLogo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); // Redirect if not logged in
    } else {
      loadLogos();
    }
  }, []);

  const loadLogos = async () => {
    const data = await fetchLogos();
    if (!data || data.length === 0) {
      alert("Session expired. Please log in again.");
      localStorage.removeItem("token");
      router.push("/login");
    }
    setLogos(data);
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = editingLogo?.imageUrl; // Keep previous image if no new file is selected

    if (formData.image) {
      const uploadRes = await uploadImage(formData.image);
      if (!uploadRes.success) {
        alert("Image upload failed");
        return;
      }
      imageUrl = uploadRes.data.url;
    }

    const logoData = {
      name: formData.name,
      url: formData.url,
      imageUrl,
    };

    if (editingLogo) {
      await updateLogo(editingLogo._id, logoData);
    } else {
      await addLogo(logoData);
    }

    setFormData({ name: "", url: "", image: null });
    setEditingLogo(null);
    loadLogos();
  };

  const handleEdit = (logo) => {
    setEditingLogo(logo);
    setFormData({
      name: logo.name,
      url: logo.url,
      image: null, // Reset file input
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this logo?");
    if (!confirmDelete) return;

    await deleteLogo(id);
    loadLogos();
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to Logout?");
    if (!confirmLogout) return;
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <Container sx={{ mt: 4, position: "relative" }}>
      {/* Logout Button */}
      <Button
        onClick={handleLogout}
        variant="contained"
        color="error"
        sx={{ position: "absolute", top: 10, right: 10 }}
      >
        Logout
      </Button>

      <Typography variant="h4" align="center" sx={{ mb: 3, fontWeight: "bold" }}>
        Admin Panel - Manage Logos
      </Typography>

      {/* Form Section */}
      <Box
  component="form"
  onSubmit={handleSubmit}
  sx={{
    p: 4,
    border: "1px solid #ddd",
    borderRadius: 3,
    boxShadow: 3,
    mb: 4,
    bgcolor: "#ffffff",
    maxWidth: "400px",
    mx: "auto",
  }}
>
  <Typography variant="h5" align="center" sx={{ fontWeight: "bold", mb: 2 }}>
    {editingLogo ? "Update Logo" : "Add New Logo"}
  </Typography>

  <Grid container spacing={3}>
    <Grid item xs={12} sm={12}>
      <Select
        name="name"
        fullWidth
        required
        value={formData.name}
        onChange={handleChange}
        displayEmpty
        sx={{
          bgcolor: "white",
          borderRadius: 2,
          "& .MuiOutlinedInput-root": { borderRadius: 2 },
        }}
      >
        <MenuItem value="" disabled>
          Select Logo Type
        </MenuItem>
        <MenuItem value="analytical">Analytical</MenuItem>
        <MenuItem value="process">Process</MenuItem>
      </Select>
    </Grid>

    <Grid item xs={12} sm={12}>
      <TextField
        label="Website URL"
        name="url"
        fullWidth
        required
        value={formData.url}
        onChange={handleChange}
        sx={{ borderRadius: 2 }}
      />
    </Grid>

    <Grid item xs={12}>
      {/* Custom File Upload Button */}
      <label htmlFor="file-upload">
        <input
          type="file"
          accept="image/*"
          id="file-upload"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <Button
          component="span"
          variant="contained"
          fullWidth
          sx={{
            background: "#1976D2",
            color: "white",
            py: 1.5,
            borderRadius: 2,
            "&:hover": { background: "#1565C0" },
          }}
        >
          {formData.image ? "File Selected ✔" : "Choose an Image"}
        </Button>
      </label>
    </Grid>

    <Grid item xs={12}>
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{
          background: editingLogo ? "#F57C00" : "#2E7D32",
          color: "white",
          py: 1.5,
          borderRadius: 2,
          fontSize: "16px",
          fontWeight: "bold",
          "&:hover": { background: editingLogo ? "#EF6C00" : "#1B5E20" },
        }}
      >
        {editingLogo ? "Update Logo" : "Add Logo"}
      </Button>
    </Grid>
  </Grid>
</Box>

      {/* Display Logos */}
      <Grid container spacing={3}>
        {logos.map((logo) => (
          <Grid item xs={12} sm={6} md={4} key={logo._id}>
            <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
              <CardMedia component="img" height="140" image={logo.imageUrl} alt={logo.name} />
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {logo.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <a href={logo.url} target="_blank" rel="noopener noreferrer">
                    {logo.url}
                  </a>
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
                <Button size="small" variant="outlined" color="primary" onClick={() => handleEdit(logo)}>
                  Edit
                </Button>
                <Button size="small" variant="contained" color="error" onClick={() => handleDelete(logo._id)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AdminPage;
