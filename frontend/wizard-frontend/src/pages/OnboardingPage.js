import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { setUsername as updateUsername, setDefaultProfilePicture } from "../services/userService";
import { getDefaultProfilePictures, uploadProfilePicture } from "../services/profilePictureService";
import { validateUsername } from "../utils/validation";

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
        await setDefaultProfilePicture(selectedDefault)
      }
      console.log("completed onboarding");
      updateUserData(prev => ({
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
    <div>
      <h1>Complete Your Profile</h1>

      <div>
        <h3>Choose a username (4-16 characters)</h3>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setError("");
          }}
        />
      </div>

      <div>
        <h3>Select a profile picture</h3>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {defaultPictures.map((pic) => (
            <img
              key={pic._id}
              src={pic.url}
              alt="default avatar"
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                cursor: "pointer",
                border: selectedDefault === pic._id ? "3px solid blue" : "none"
              }}
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
        <div style={{ marginTop: "20px" }}>
          <p>Or upload your own</p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => {
                const file = e.target.files[0];

                if (!file) return;

                const allowedTypes = [
                  "image/jpeg",
                  "image/png",
                  "image/webp"
                ];
                
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
          <div style={{ marginTop: "15px" }}>
            <p>Preview:</p>
            <img
              src={previewURL}
              alt="preview"
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                objectFit: "cover"
              }}
            />

            <div>
              <button
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
          </div>
        )}
      </div>

      <button disabled={loading} onClick={handleSubmit}>
        {loading ? "Saving..." : "Finish Setup"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default OnboardingPage;