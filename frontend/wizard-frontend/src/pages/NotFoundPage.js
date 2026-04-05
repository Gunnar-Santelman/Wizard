import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import "../styling/NotFoundPage.css";

export default function NotFoundPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>404 - Page Not Found</h1>
      <p>This page does not exist.</p>
      <p>For more wizardry, stay on the Yellow Brick Road.</p>

      <div className="road-container">
        <div className="yellow-brick">...</div>
        <div className="yellow-brick">...</div>
        <div className="yellow-brick">...</div>

        <button
          className="yellow-brick active-brick"
          onClick={() => navigate(user ? "/home" : "/login")}
        >
          {user ? "Go Home" : "Go Login"}
        </button>
        <div className="yellow-brick">...</div>
        <div className="yellow-brick">...</div>
        <div className="yellow-brick">...</div>
      </div>
    </div>
  );
}