import "../styling/ScoreCell.css"
// shows just the basic score that the user received for each round
export default function ScoreCell({
  score = -20
}) {

  return (
    <div className="score-cell">

      {/* score */}
      <div className="score">
        {score}
      </div>

    </div>
  );
}
