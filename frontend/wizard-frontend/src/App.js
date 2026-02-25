import logo from './logo.svg';
import './App.css';


import {Routes, Route} from "react-router-dom";
import Home from "./Home";
import LobbyPage from "./LobbyPage";
import GamePage from "./GamePage";
//import {auth} from "./services/firebase.js";

function App() {

  // useEffect(() => {
  //   console.log("API key loaded:", process.env.REACT_APP_FIREBASE_API_KEY);
  //   console.log("Firebase Auth object:", auth);
  //   console.log("Current user:", auth.currentUser)
  // }, []);

  return (
    <Routes>
      <Route path = "/" element = {<Home />} />
      <Route path = "/lobby/:gameId" element = {<LobbyPage />} />
      <Route path = "/game/:gameId" element = {<GamePage />} />
    </Routes>
  );
}

export default App;
