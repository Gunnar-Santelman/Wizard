import { useState } from "react";
import PlayerInfocard from ':/PlayerInfocard.jsx';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function Scoreboard({
  playerIDs = ["123456", "678910", "676767"],
  currentRound = 3,
  totalRounds = 5
}) {

    // Scores are accessed through the Player object
    // Player.getRoundScores() --> dictionary with the player's score for each round, with round number as the key
    // Player.getTotalScore() --> running total, integer

    // Column Headers: Player, Round 1 .... Round n, Total
    // Row Headers: Players 1 through n - profile pic & name

    function createData(player) {

      playerInfo = PlayerInfocard(player.getUsername(),player.getAvatarURL())
      score1 = BidScoreCell(player.getTricks.get(0), player.getBids.get(0), player.getRoundScores.get(0))
      score2 = BidScoreCell(player.getTricks.get(1), player.getBids.get(1), player.getRoundScores.get(1))
      score3 = BidScoreCell(player.getTricks.get(2), player.getBids.get(2), player.getRoundScores.get(2))
      total = ScoreCell(player.getTotalScore)

      return { playerInfo, score1, score2, score3, total };
      // should return:
      // PlayerInfocard, BidScoreCell (n times), ScoreCell
    }

    const rows = [
        createData(playerIDs[0], player[0].getRoundScores(), player[0].getTotalScore()),
        createData(playerIDs[1], player[1].getRoundScores(), player[1].getTotalScore()),
        createData(playerIDs[2], player[2].getRoundScores(), player[2].getTotalScore()),
    ]

    // Col labels are the PlayerInfocards
    // Row labels are round numbers
    
  return (
     <div>
     <TableContainer component={Paper}>
       <Table sx={{ minWidth: 650 }} aria-label="simple table">
         <TableHead>
           <TableRow>
             <TableCell>Scoreboard</TableCell>
             <TableCell align="right">Player</TableCell>
             <TableCell align="right">Round 1</TableCell>
             <TableCell align="right">Round 2</TableCell>
             <TableCell align="right">Round 3</TableCell>
             <TableCell align="right">Subtotal</TableCell>
           </TableRow>
         </TableHead>
         <TableBody>
           {rows.map((row) => (
             <TableRow
               key={row.name}
               sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
             >
               <TableCell component="th" scope="row">
                 {row.name}
               </TableCell>
               <TableCell align="right">{row[0]}</TableCell>
               <TableCell align="right">{row[1]}</TableCell>
               <TableCell align="right">{row[2]}</TableCell>
               <TableCell align="right">{row[3]}</TableCell>
               <TableCell align="right">{row[4]}</TableCell>
             </TableRow>
           ))}
         </TableBody>
       </Table>
     </TableContainer>
     </div>
   );
 }
 