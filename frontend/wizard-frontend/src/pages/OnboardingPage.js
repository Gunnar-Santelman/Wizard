import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import {
  setUsername as updateUsername,
  setDefaultProfilePicture,
} from "../services/userService";
import {
  getDefaultProfilePictures,
  uploadProfilePicture,
} from "../services/profilePictureService";
import { validateUsername } from "../utils/validation";
import "../styling/OnboardingPage.css"

function OnboardingPage() {
  const { user, updateUserData, refreshUserData } = useAuth();

  const [username, setUsername] = useState("");
  const [defaultPictures, setDefaultPictures] = useState([]);
  const [selectedDefault, setSelectedDefault] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadDefaultPictures = async () => {
      try {
        const pictures = await getDefaultProfilePictures();
        setDefaultPictures(pictures);
      } catch (err) {
        console.error("Failed to load default pictures", err);
      }
    };

    loadDefaultPictures();
  }, []);

  useEffect(() => {
    return () => {
      if (previewURL) {
        URL.revokeObjectURL(previewURL);
      }
    };
  }, [previewURL]);

  const handleSubmit = async () => {
    const usernameError = validateUsername(username);
    if (usernameError) {
      setError(usernameError);
      return;
    }
    if (!uploadedFile && !selectedDefault) {
      setError("Please select or upload a profile picture");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await updateUsername(username);

      if (uploadedFile) {
        await uploadProfilePicture(uploadedFile);
      } else if (selectedDefault !== null) {
        await setDefaultProfilePicture(selectedDefault);
      }
      console.log("completed onboarding");
      updateUserData((prev) => ({
        ...prev,
        completedOnboarding: true,
      }));
      await refreshUserData(user.uid);
      console.log("setOnboardingComplete");
      navigate("/home", { replace: true });
    } catch (err) {
      console.error(err);
      setError("Failed to complete onboarding");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <h1 className="onboarding-title">Create Your Wizard</h1>

        <div className="section">
          <h3>Choose a username (4-16 characters)</h3>
          <input
            className="text-input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError("");
            }}
          />
        </div>

        <div className="section">
          <h3>Select a profile picture</h3>

          <div className="avatar-grid">
            {defaultPictures.map((pic) => (
              <img
                key={pic._id}
                src={pic.url}
                alt="default avatar"
                className={`avatar ${selectedDefault===pic._id ? "selected" : ""}`}
                onClick={() => {
                  setSelectedDefault(pic._id);

                  if (previewURL) {
                    URL.revokeObjectURL(previewURL);
                  }

                  setUploadedFile(null);
                  setPreviewURL(null);

                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }

                  setError("");
                }}
              />
            ))}
          </div>

          <div className="upload-section">
            <p className="divider-text">Or upload your own</p>

            <button className="upload-btn" onClick={() => fileInputRef.current.click()}>
              Upload Image
            </button>
            <input
              className="file-input"
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => {
                const file = e.target.files[0];

                if (!file) return;

                const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

                if (!allowedTypes.includes(file.type)) {
                  setError("Only JPG, PNG, and WEBP images are allowed");
                  return;
                }

                if (file.size > 2 * 1024 * 1024) {
                  setError("Image must be under 2MB");
                  return;
                }

                setUploadedFile(file);
                setSelectedDefault(null);
                setError("");
                setPreviewURL(URL.createObjectURL(file));
              }}
            />
          </div>
          {previewURL && (
            <div className="preview-section">
              <p>Preview:</p>
              <img
                src={previewURL}
                className="avatar"
                alt="preview"
                style={{ display: "block"}}
              />

                <button
                  className="remove-btn"
                  onClick={() => {
                    if (previewURL) {
                      URL.revokeObjectURL(previewURL);
                    }

                    setUploadedFile(null);
                    setPreviewURL(null);

                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                >
                  Remove uploaded picture
                </button>
            </div>
          )}
        </div>

        <button className="primary-btn" disabled={loading} onClick={handleSubmit}>
          {loading ? "Saving..." : "Finish Setup"}
        </button>

        {error && <p className="error-text">{error}</p>}
      </div>
    </div>
  );
}

export default OnboardingPage;
