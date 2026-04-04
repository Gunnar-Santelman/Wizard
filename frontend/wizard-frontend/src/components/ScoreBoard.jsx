import { useState } from "react";
import PlayerInfocard from ':/PlayerInfocard.jsx';
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
  currentRound = 3,
  totalRounds = 5
}) {

    // Scores are accessed through the Player object
    // Player.getRoundScores() --> dictionary with the player's score for each round, with round number as the key
    // Player.getTotalScore() --> running total, integer

    // Column Headers: Player, Round 1 .... Round n, Total
    // Row Headers: Players 1 through n - profile pic & name
  function createData(player) {
    const data = {};

    // PlayerInfocard JSX
    data.playerInfocard = (
      <PlayerInfocard
        username={player.getUsername()}
        avatarUrl={player.getAvatarURL()}
        showBids={false}
      />
    );

    // BidScoreCell JSX for each round
    data.bidScoreCells = [];
    for (let i = 0; i < currentRound; i++) {
      data.bidScoreCells.push(
        <BidScoreCell
          key={`bid-score-${i}`}
          tricksTaken={player.getTricks().get(i)}
          bidsMade={player.getBids().get(i)}
          score={player.getRoundScores().get(i)}
        />
      );
    }

    // ScoreCell JSX
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

  // Col labels are the PlayerInfocards
  // Row labels are round numbers
    
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
                <TableCell component="th" scope="row">
                  {row.playerInfocard}
                </TableCell>
          
                {/* Render each round cell */}
                {row.bidScoreCells.map((cell, cellIndex) => (
                  <TableCell key={`round-cell-${cellIndex}`} align="right">
                    {cell}
                  </TableCell>
                ))}
          
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
