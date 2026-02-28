import logo from '../logo.svg';
import '../styling/App.css';


import {Routes, Route} from "react-router-dom";
import Home from "./Home.js";
import LobbyPage from "./LobbyPage.js";
import GamePage from "./GamePage.js";
import {auth} from "../services/firebase.js";
import {useEffect} from "react"

function App() {

  // useEffect(() => {
  //   console.log("API key loaded:", process.env.REACT_APP_FIREBASE_API_KEY);
  //   console.log("Firebase Auth object:", auth);
  //   console.log("Current user:", auth.currentUser)
  // }, []);

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
