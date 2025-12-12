"use client";

import { useState, useRef, ChangeEvent } from "react";
import {
  TextField,
  Button,
  Avatar,
  Box,
  Typography,
  CircularProgress,
  Alert,
  InputLabel,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { useSession } from "next-auth/react";

interface User {
  firstName?: string;
  lastName?: string;
  bio?: string;
  image?: string;
  phone?: string;
}

const ProfileSettings = () => {
  const { data: session, status } = useSession();
  const user = session?.user as User;
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    LastName: user?.lastName || "",
    bio: user?.bio || "",
    avatar: user?.image || "",
    phone: user?.phone || "",
  });
  const setion = useSession();
  // console.log(setion);
  // console.log(user?.lastName);
  const [previewAvatar, setPreviewAvatar] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.match("image.*")) {
      setError("Please select an image file (JPEG, PNG, GIF)");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("File size must be less than 2MB");
      return;
    }

    setError("");
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
    setFormData((prev) => ({ ...prev, avatar: file as any }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In a real app, you would upload the avatar and update the profile
      console.log("Profile updated:", {
        firstName: formData.firstName,
        LastName: formData.LastName,
        bio: formData.bio,
        avatar: formData.avatar,
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="rounded-xl border bg-white p-4 shadow-soft">
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Profile Settings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Profile updated successfully!
        </Alert>
      )}

      <Box sx={{ display: "flex", alignItems: "center", mb: 4, gap: 3 }}>
        <Avatar
          src={previewAvatar ? previewAvatar : user?.image}
          sx={{
            width: 80,
            height: 80,
            border: "1px solid",
            borderColor: "divider",
          }}
        />
        <Box>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            accept="image/*"
            hidden
          />
          <Button
            variant="outlined"
            startIcon={<CloudUpload />}
            onClick={triggerFileInput}
          >
            Change Avatar
          </Button>
          <Typography
            variant="caption"
            display="block"
            sx={{ mt: 1, color: "text.secondary" }}
          >
            JPG, PNG or GIF. Max size 2MB
          </Typography>
        </Box>
      </Box>

      <div className="mb-4 flex flex-col items-center gap-3 sm:flex-row">
        <div className="w-full">
          <InputLabel className="text-sm">First Name</InputLabel>
          <TextField
            fullWidth
            placeholder={user?.firstName || ""}
            name="name"
            onChange={handleChange}
            variant="outlined"
          />
        </div>
        <div className="w-full">
          <InputLabel className="text-sm">Last Name</InputLabel>
          <TextField
            fullWidth
            name="name"
            placeholder={user?.lastName || ""}
            onChange={handleChange}
            variant="outlined"
          />
        </div>
      </div>
      <div>
        <InputLabel className="text-sm">Phone</InputLabel>
        <TextField
          fullWidth
          name="bio"
          onChange={handleChange}
          variant="outlined"
          placeholder={user?.phone}
        />
      </div>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isLoading}
          sx={{ minWidth: 120 }}
        >
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Save Changes"
          )}
        </Button>
      </Box>
    </div>
  );
};

export default ProfileSettings;
