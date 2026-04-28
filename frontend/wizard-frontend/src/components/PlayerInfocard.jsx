import "../styling/PlayerInfocard.css"
// displays game info to the users about player information such as their username, their bid, and how many tricks they've taken
export default function PlayerInfocard({
  username = "Guest",
  tricksTaken = 2,
  bidsMade = 4,
  avatarUrl = "https://wl-brightside.cf.tsp.li/resize/728x/jpg/af0/e0b/73c3f25248a70ded2a09db1e1b.jpg",
  showBids = true
}) {

  // ensures that the default state simply displays as 0
  if (bidsMade === -1) {
    bidsMade = 0;
  }

  return (
    <div className="player-infocard">
      {/* profile picture */}
      <img
        // shows avatar url
        height="70px"
        width="70px"
        src={avatarUrl}
        alt={ username + "'s profile picture" }
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
