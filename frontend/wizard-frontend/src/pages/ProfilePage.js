import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { auth } from "../services/firebase";
import { signOut, updatePassword } from "firebase/auth";
import { uploadProfilePicture } from "../services/profilePictureService";
import "../styling/ProfilePage.css"

export default function ProfilePage() {
  const { user, userData, loading, refreshUserData } = useAuth();

  const [newPassword, setNewPassword] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  const statLabels = {
    gamesPlayed: "Games Completed",
    gamesWon: "Wins",
    gamesLost: "Losses",
  };
  const orderedStats = ["gamesPlayed", "gamesWon", "gamesLost"];

  useEffect(() => {
    return () => {
      if (previewURL) {
        URL.revokeObjectURL(previewURL);
      }
    };
  }, [previewURL]);

  if (loading) return <p>Loading...</p>;
  if (!userData) return <p>No user data found.</p>;

  const handleChangePassword = async () => {
    try {
      if (!newPassword || newPassword.length < 6) {
        setStatus("Password must be at least 6 characters.");
        return;
      }

      await updatePassword(user, newPassword);
      setStatus("Password updated successfully.");
      setNewPassword("");
    } catch (err) {
      console.error(err);

      if (err.code === "auth/requires-recent-login") {
        setStatus("Please log out and log back in before changing password.");
      } else {
        setStatus("Error updating password.");
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setStatus("Only JPG, PNG, and WEBP images are allowed.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setStatus("Image must be under 2MB.");
      return;
    }

    // Cleanup old preview
    if (previewURL) {
      URL.revokeObjectURL(previewURL);
    }

    setImageFile(file);
    setPreviewURL(URL.createObjectURL(file));
    setStatus("");
  };

  const handleImageUpload = async () => {
    if (!imageFile) {
      setStatus("Select an image first.");
      return;
    }

    try {
      setUploading(true);

      await uploadProfilePicture(imageFile);
      await refreshUserData();

      setStatus("Profile picture updated.");

      // Reset state
      setImageFile(null);
      setPreviewURL(null);
    } catch (err) {
      console.error(err);
      setStatus("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  async function handleLogout() {
    await signOut(auth);
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <button className = "link-btn" onClick={() => navigate("/home")}>Go Home</button>

          <button className = "link-btn" onClick={handleLogout}>Logout</button>
        </div>

        <h1 className="profile-title">{userData.username}'s Profile</h1>

        <img
          src={userData.profilePicture}
          alt="Profile"
          className="profile-avatar"
        />

        <div className="section">
          <h3>Update Profile Picture</h3>
          <button className="secondary-btn" onClick = {() => document.getElementById("fileInput").click()}>Choose Image</button>
          <input id = "fileInput" type="file" className = "hidden-file-input" onChange={handleFileChange} />

          {previewURL && (
            <div className="preview-section">
              <p>Preview:</p>
              <img
                src={previewURL}
                alt="preview"
                className="avatar-preview"
              />
            </div>
          )}

          <button className = "primary-btn" onClick={handleImageUpload} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </div>

        <div className="section">
          <h3>Change Password</h3>
          <input
            className="text-input"
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button className = "primary-btn" onClick={handleChangePassword}>Update Password</button>
        </div>

        <div className="section">
          <h3>Statistics</h3>
          {userData.statistics.size === 0 ? (
            <p className="muted-text">No stats yet.</p>
          ) : (
            <ul className="stats-list">
              {orderedStats.map((key) => (
                <li key = {key}>
                  <span>{statLabels[key]}</span>
                  <span>{userData.statistics.get(key) ?? 0}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {status && <p className="status-text">{status}</p>}
      </div>
    </div>
  );
}
