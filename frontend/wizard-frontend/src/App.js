import logo from './logo.svg';
import './App.css';

// Temp Stuff
import * as gameApi from "./api/gameApi.js";
import { useEffect } from 'react';



function App() {
  // Temp Stuff (Remove UseEffect after demo)
  useEffect(() => {
    window.gameApi = gameApi;
    console.log("gameApi attached to window");
  }, []);

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
