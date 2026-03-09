import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>This page does not exist.</p>
      <p>For more wizardy, stay on the Yellow Brick Road.</p>

      {/* TODO: Make buttons yellow */}
      {user ? (
        <button onClick={() => navigate("/home")}>Go Home</button>
      ) : (
        <button onClick={() => navigate("/login")}>Go Login</button>
      )}
    </div>
  );
}