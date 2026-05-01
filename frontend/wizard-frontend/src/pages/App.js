import '../styling/App.css';
import {Navigate, Routes, Route} from "react-router-dom";
import Home from "./Home.js";
import LobbyPage from "./LobbyPage.js";
import GamePage from "./GamePage.js";
import OnboardingPage from './OnboardingPage.js';
import LoginPage from './LoginPage.js';
import ProfilePage from './ProfilePage.js';
import TutorialPage from "./TutorialPage.js";
import NotFoundPage from './NotFoundPage.js';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import PublicRoute from '../components/PublicRoute.jsx';
import { AuthProvider } from "../context/authContext.js";

// defines the various navigation routes throughout the program
function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path = "/" element = {<Navigate to = "/home" replace/>} />

        <Route element = {<PublicRoute/>}>
          <Route path = "/login" element = {<LoginPage />} />
        </Route>

       <Route element = {<ProtectedRoute/>}>
          <Route path = "/onboarding" element = {<OnboardingPage />} />
          <Route path = "/home" element = {<Home />} />
          <Route path = "/lobby/:gameId" element = {<LobbyPage />} />
          <Route path = "/game/:gameId" element = {<GamePage />} />
          <Route path = "/profile" element = {<ProfilePage />} />
          <Route path = "/tutorial" element = {<TutorialPage />} />
        </Route>

        <Route path = "*" element = {<NotFoundPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
