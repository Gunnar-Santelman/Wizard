import logo from './logo.svg';
import './App.css';

/*
import * as gameApi from "./api/gameApi.js";
import { auth } from './services/firebase.js'
import { useEffect } from 'react';
*/

function App() {
  /*
  useEffect(() => {
    window.gameApi = gameApi;
    console.log("gameApi attached to window");
  }, []);
  */

  /*
  useEffect(() => {
    console.log("API key loaded:", process.env.REACT_APP_FIREBASE_API_KEY);
    console.log("Firebase Auth object:", auth);
    console.log("Current user:", auth.currentUser)
  }, []);
  */

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>Hot Reload Test</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
