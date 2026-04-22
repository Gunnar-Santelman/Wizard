import PlayerInfocard from "./PlayerInfocard.jsx";
import ScoreCell from "./ScoreCell.jsx";
import socket from "../socket.js";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";

export default function Scoreboard({
  gameId,
  players = [], // Array of player objects
  currentRound = 0,
  gameComplete
}) {
  const [showScoreboard, setShowScoreboard] = useState(false);

  useEffect(() => {
    if (currentRound !== 0 && currentRound !== 1) {
      setShowScoreboard(true);
    }
  }, [currentRound]) 

  function createData(player) {
    // creates jsx objects for each cell of player data
    const data = {};

    data.playerInfocard = (
      <PlayerInfocard
        username={player.name}
        showBids={false}
      />
    );
    console.log(player);
    data.roundScoreCells = [];
    for (let i = 0; i < currentRound; i++) {
      data.roundScoreCells.push(<ScoreCell score={player.roundScores[i]} />);
    }

    data.totalScoreCell = (
      <ScoreCell score={player.score} />
    );

    return data;
  }

  function createRows(players) {
    const rows = [];
    for (let i = 0; i < players.length; i++) {
      rows.push(createData(players[i]));
    }
    return rows;
  }

  function handleExitGame() {
    socket.emit("leaveGame", {gameId})
  }

  function renderExitButton() {
    if (!gameComplete) {
      return (
        <button onClick={() => setShowScoreboard(false)}>Close Scoreboard</button>
      )
    }
    else {
      return (
        <button onClick={handleExitGame}>Exit Game</button>
      )
    }
  }

  const rows = createRows(players);
  const roundCount = players.length > 0 ? Math.max(...players.map(player=>Object.keys(player.roundScores || {}).length)) : 0
  const color = "rgba(255, 255, 255, 0.97)"
  if (!showScoreboard && !gameComplete) {
    return;
  }

  return (
    <div>
    <TableContainer component={Paper}
      style={{ position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: color,
        alignItems: "center",
        padding: "1rem",
        overflowY: "auto",
        overflowX: "auto",
        display: "block",
        zIndex: "1000"}}>
      <Table aria-label="scoreboard table">
        <TableHead>
          <TableRow>
            <TableCell style = {{position: "sticky", top: 0, backgroundColor: color, minWidth:"10vw", width:"10vw"}}>
              {renderExitButton()}
            </TableCell>

            {/*Player Headers Across Top */}
            {players.map((player, index) => (
              <TableCell align = "center" style = {{position: "sticky", top: 0, backgroundColor: color}}>
                <h3>{player.name}</h3>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {/*One row per round*/}
          {Array.from({ length: roundCount}, (_, roundIndex) => (
            <TableRow>
              <TableCell component = "th" scope="row">
                <h3>Round {roundIndex + 1}</h3>
              </TableCell>

              {players.map((player, playerIndex) => (
                <TableCell align="center">
                  <ScoreCell score= {player.roundScores?.[roundIndex]}/>
                </TableCell>
              ))}
            </TableRow>
          ))}

          {/*Final Total Rows*/}
          <TableRow>
            <TableCell component = "th" scope = "row">
              <h3>Total</h3>
            </TableCell>
              {players.map((player, index) => (
                <TableCell align = "center" style = {{minWidth:"20vw", width:"20vw"}}>
                  <ScoreCell score={player.score}/>
                </TableCell>
              ))}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
}