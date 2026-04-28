import ScoreCell from "./ScoreCell.jsx";
import socket from "../socket.js";
import "../styling/ScoreBoard.css"
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

// creates scoreboard to display user scores at the end of the round
export default function Scoreboard({
  gameId,
  players = [],
  currentRound = 0,
  gameComplete,
  showScoreboard = false,
  setShowScoreboard
}) {

  function handleExitGame() {
    socket.emit("leaveGame", {gameId})
  }

  // creates the exit game button it is the scoreboard of the final round of the game
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

  // keeps the roundCount properly in sync with the players
  const roundCount = players.length > 0 ? Math.max(...players.map(player=>Object.keys(player.roundScores || {}).length)) : 0
  if (!showScoreboard && !gameComplete) {
    return;
  }

  return (
    <div>
    <TableContainer component={Paper} className="score-table">
      <Table aria-label="scoreboard table">
        <TableHead>
          <TableRow>
            <TableCell className = "exit-cell">
              {renderExitButton()}
            </TableCell>

            {/*Player Headers Across Top */}
            {players.map((player, index) => (
              <TableCell className = "player-name" align = "center">
                <h3>{player.name}</h3>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {/*One row per round displaying round scores for each player*/}
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

          {/*Final Total Row for each player*/}
          <TableRow>
            <TableCell component = "th" scope = "row">
              <h3>Total</h3>
            </TableCell>
              {players.map((player, index) => (
                <TableCell className = "total-score" align = "center">
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