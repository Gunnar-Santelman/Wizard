import "../styling/ScoreCell.css"
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
