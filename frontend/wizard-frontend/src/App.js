import logo from './logo.svg';
import './App.css';


import {Routes, Route} from "react-router-dom";
import Home from "./Home";
import LobbyPage from "./LobbyPage";
import GamePage from "./GamePage";

function App() {
  return (
    <Routes>
      <Route path = "/" element = {<Home />} />
      <Route path = "/lobby/:gameId" element = {<LobbyPage />} />
      <Route path = "/game/:gameId" element = {<GamePage />} />
    </Routes>
  );
}

export default App;
