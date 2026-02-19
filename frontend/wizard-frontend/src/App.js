import logo from './logo.svg';
import './App.css';

/*
import * as gameApi from "./api/gameApi.js";
import { useEffect } from 'react';
import socket from "./socket";
*/

function App() {
  // API TEST
  /*
  useEffect(() => {
    window.gameApi = gameApi;
    console.log("gameApi attached to window");
  }, []);
  */

  // WEBSOCKET TEST
  /*
  useEffect(() => {
    socket.emit("pingTest", "Hello backend");

    socket.on("pongTest", (msg) => {
      console.log(msg);
    });

    return () => {
      socket.off("pongTest");
    }
  }, []);
  return <div>WebSocket Test</div>
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
