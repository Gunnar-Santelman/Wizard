import { useState } from "react";

export default function PlayerInfocard({
  username = "Guest",
  tricksTaken = 2,
  bidsMade = 4,
  avatarUrl = "https://wl-brightside.cf.tsp.li/resize/728x/jpg/af0/e0b/73c3f25248a70ded2a09db1e1b.jpg",
}) {

  return (
    <div
      className="player-infocard"
      style={{
        width: "300px",
        minHeight: "50px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "green",
        color: "white",
        gap: "10px",
        padding: "10px",
        borderRadius: "50px",
      }}
    >

      {/* profile picture */}
      <img
        height="70px"
        width="70px"
        src={avatarUrl}
        alt={ "Display showing that " + username + " has taken " + tricksTaken + " of " + bidsMade + " tricks." }
        style={{
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />

      {/* username */}
      <span
        style={{
          fontSize: "18px",
          textAlign: "center",
          marginLeft: "auto",
        }}
      >
        {username}
      </span>

      {/* bids and tricks */}
      <div
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          marginLeft: "auto",
        }}
      >
        {tricksTaken}/{bidsMade}
      </div>

    </div>
  );
}
