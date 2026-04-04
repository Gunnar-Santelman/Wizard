import { useState } from "react";
import PlayerInfocard from '/PlayerInfocard.jsx';
import ScoreCell from './ScoreCell.jsx';
import BidScoreCell from './BidScoreCell.jsx';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function Scoreboard({
  players = [], // Array of player objects
  currentRound = 0
}) { 

  function createData(player) {
    // creates jsx objects for each cell of player data
    const data = {};

    data.playerInfocard = (
      <PlayerInfocard
        username={player.getUsername()}
        avatarUrl={player.getAvatarURL()}
        showBids={false}
      />
    );

    data.roundScoreCells = [];
    for (let i = 0; i < currentRound; i++) {
      data.roundScoreCells.push(
        <ScoreCell
          key={`score-${i}`}
          score={player.getRoundScores().get(i)}
        />
      );
    }

    data.totalScoreCell = (
      <ScoreCell score={player.getTotalScore()} />
    );

    return data;
  }

  function createRows(playersList) {
    const rows = [];
    for (let i = 0; i < playersList.length; i++) {
      rows.push(createData(playersList[i]));
    }
    return rows;
  }

  const rows = createRows(players);

  // Column Headers: Player, Round 1 .... Round n, Total
  // Row Headers: Players 1 through n - Infocard

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="scoreboard table">
          <TableHead>
            <TableRow>
              <TableCell>Player</TableCell>
             
              {/* Headers for Rounds 1 through current */}
              {Array.from({ length: currentRound }, (_, i) => (
                <TableCell key={`round-${i + 1}`} align="right">
                  Round {i + 1}
                </TableCell>
              ))}

              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow
                key={`player-${rowIndex}`}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {/* Render cell for PlayerInfocard */}
                <TableCell component="th" scope="row">
                  {row.playerInfocard}
                </TableCell>
          
                {/* Render cells for each round so far */}
                {row.roundScoreCells.map((cell, cellIndex) => (
                  <TableCell key={`round-cell-${cellIndex}`} align="right">
                    {cell}
                  </TableCell>
                ))}
          
                {/* Render cell for total score */}
                <TableCell align="right">
                  {row.totalScoreCell}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          
        </Table>
      </TableContainer>
    </div>
  );
}
