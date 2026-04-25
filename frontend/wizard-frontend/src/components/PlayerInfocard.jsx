import "../styling/PlayerInfocard.css"
export default function PlayerInfocard({
  username = "Guest",
  tricksTaken = 2,
  bidsMade = 4,
  avatarUrl = "https://wl-brightside.cf.tsp.li/resize/728x/jpg/af0/e0b/73c3f25248a70ded2a09db1e1b.jpg",
  showBids = true
}) {

  if (bidsMade === -1) {
    bidsMade = 0;
  }

  return (
    <div className="player-infocard">

      {/* profile picture */}
      <img
        height="70px"
        width="70px"
        src={avatarUrl}
        alt={ "Display showing that " + username + " has taken " + tricksTaken + " of " + bidsMade + " tricks." }
        className="profile-picture"
      />

      {/* username */}
      <span
        className="username"
      >
        {username}
      </span>

      {/* bids and tricks, if showBids is true*/}
      {showBids && (
        <div className="bid-display">
          {tricksTaken}/{bidsMade}
        </div>
      )}

    </div>
  );
}
