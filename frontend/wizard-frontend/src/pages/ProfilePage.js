import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { auth } from "../services/firebase";
import { signOut, updatePassword } from "firebase/auth";
import { uploadProfilePicture } from "../services/profilePictureService";

export default function ProfilePage() {
  const { user, userData, loading, refreshUserData } = useAuth();

  const [newPassword, setNewPassword] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  // 🔄 Cleanup preview URL
  useEffect(() => {
    return () => {
      if (previewURL) {
        URL.revokeObjectURL(previewURL);
      }
    };
  }, [previewURL]);

  if (loading) return <p>Loading...</p>;
  if (!userData) return <p>No user data found.</p>;

  // 🔐 Change Password
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

  // 🖼 Handle file selection + validation
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

  // 🖼 Upload Profile Picture
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
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px"
        }}
      >
        <button onClick={() => navigate("/home")}>
          Go Home
        </button>

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>
      
      <h1>{userData.username}'s Profile</h1>

      <img
        src={userData.profilePicture}
        alt="Profile"
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          objectFit: "cover"
        }}
      />

      <div style={{ marginTop: "10px" }}>
        <input type="file" onChange={handleFileChange} />

        {previewURL && (
          <div style={{ marginTop: "10px" }}>
            <p>Preview:</p>
            <img
              src={previewURL}
              alt="preview"
              width={80}
              style={{ borderRadius: "50%", objectFit: "cover" }}
            />
          </div>
        )}

        <button onClick={handleImageUpload} disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>

      <section style={{ marginTop: "20px" }}>
        <h2>Change Password</h2>
        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button onClick={handleChangePassword}>
          Update Password
        </button>
      </section>

      <section style={{ marginTop: "20px" }}>
        <h2>Statistics</h2>
        {userData.statistics.size === 0 ? (
          <p>No stats yet.</p>
        ) : (
          <ul>
            {[...userData.statistics.entries()].map(([key, value]) => (
              <li key={key}>
                {key}: {value}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section style={{ marginTop: "20px" }}>
        <h2>Friends</h2>
        {userData.friends.length === 0 ? (
          <p>No friends yet.</p>
        ) : (
          <ul>
            {userData.friends.map((friend, i) => (
              <li key={i}>{friend}</li>
            ))}
          </ul>
        )}
      </section>

      <section style={{ marginTop: "20px" }}>
        <h2>Achievements</h2>
        {userData.achievements.length === 0 ? (
          <p>No achievements yet.</p>
        ) : (
          <ul>
            {userData.achievements.map((ach, i) => (
              <li key={i}>{ach}</li>
            ))}
          </ul>
        )}
      </section>

      {status && <p style={{ marginTop: "20px" }}>{status}</p>}
    </div>
  );
}