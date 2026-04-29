export default function ScoreCell({
  score = -20
}) {

  return (
    <div
      className="score-cell"
      style={{
        minHeight: "50px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
      }}
    >

      {/* score */}
      <div
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          textAlign: "center",
          marginLeft: "auto",
          marginRight: "auto"
        }}
      >
        {score}
      </div>

    </div>
  );
}
