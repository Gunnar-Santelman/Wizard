import "../styling/TutorialPage.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TutorialPage() {
  const [pageNumber, setPageNumber] = useState(1);
  const navigate = useNavigate();

  function displayHeader() {
    switch (pageNumber) {
      case 1:
        return <h1 className="header">Object Of The Game</h1>;
      case 2:
        return <h1 className="header">The Deal</h1>;
      case 3:
        return <h1 className="header">Bidding</h1>;
      case 4:
        return <h1 className="header">The Play</h1>;
      case 5:
        return <h1 className="header">Trick Winning</h1>;
      case 6:
        return <h1 className="header">Leading Wizards or Jesters</h1>;
      case 7:
        return <h1 className="header">Scoring</h1>;
      default:
        return <h1 className="header">Example Scoring</h1>;
    }
  }
  function displayImage() {
    return (
      <img className="image" src={`/tutorial-images/Page_${pageNumber}.png`} alt = {`Tutorial for Page ${pageNumber}`}/>
    );
  }
  function displayBody() {
    switch (pageNumber) {
      case 1:
        return (
          <p className="body">
            The object is to correctly predict the exact number of tricks you
            will take in each hand. You receive points for being correct, and
            the person with the most points wins the game.
          </p>
        );
      case 2:
        return (
          <p className="body">
            The first dealer of the game is the host. After each hand, the deal
            passes to the left, and the new dealer shuffles the entire deck. On
            the first deal, each player receives one card. Two cards are dealt
            on the second deal, three on the third, and so on. After the deal,
            the next card in the deck is turned up to determine the trump suit.
            If the card turned up is a Jester or Wizard, then there is no trump.
            On the last hand of the game, all cards will be dealt out, so there
            is no trump.
          </p>
        );
      case 3:
        return (
          <p className="body">
            Each player in turn beginning to the left of the dealer states the
            number of tricks they want to take (limited by the number of cards
            in the current hand). The total number of tricks bid may or may not
            equal the total number of tricks available.
          </p>
        );
      case 4:
        return (
          <p className="body">
            The play begins to the left of the dealer. Any card may be led.
            Players continue to play in clockwise order and must follow suit if
            possible. If a player cannot follow the suit led, the player may
            play any other suit, including the trump suit. A Wizard or Jester
            may be played at any time, even if the player is holding a card of
            the suit led.
          </p>
        );
      case 5:
        return [
          <p className="body">A trick is won:</p>,
          <p className="body">(a) by the first Wizard played.</p>,
          <p className="body">
            (b) if no Wizard is played, by the highest trump played.
          </p>,
          <p className="body">
            (c) if no trump is played, by the highest card of the suit led.
          </p>,
          <p className="body">The winner of the trick will lead next.</p>,
        ];
      case 6:
        return (
          <p className="body">
            If the lead card is a Wizard, it wins the trick and players may play
            any card they wish, including another Wizard. If the lead card is a
            Jester, it is a null card and the suit for this round is determined
            by the next card played. Jesters always lose. The one exception to
            this is if only Jesters are played, the first Jester played wins the
            trick.
          </p>
        );
      case 7:
        return (
          <p className="body">
            To win points, you must make your exact bid. You cannot be over or
            under your bid, otherwise you only lose points. If you bid 0 and do
            not take any tricks, then you have made your bid. You always receive
            a bonus of 20 points for making your bid. You receive an additional
            10 points for each trick you make that you bid. You deduct 10 points
            for each trick you win over or under your bid.
          </p>
        );
      default:
        return (
          <p className="body">
            If Paul calls for 0 tricks, and did not take any, he will add 20
            points to his total score. If Thomas bid 4, but actually took 1, he
            will deduct 30 points from his overall score. If Marie called 2, and
            got her 2, she will add 40 points to her total score.
          </p>
        );
    }
  }

  return (
    <div className="tutorial-container">
      <div className="tutorial-card">
        {displayHeader()}
        {displayImage()}
        {displayBody()}

        <div className="button-row">
          <button
            className="primary-btn"
            id="previous"
            onClick={() => setPageNumber(pageNumber - 1)}
            disabled= {pageNumber <= 1}
          >
            Previous
          </button>
          <button
            className="primary-btn"
            id="next"
            onClick={() => setPageNumber(pageNumber + 1)}
            disabled = {pageNumber >= 8}
          >
            Next
          </button>
        </div>
        <button className="secondary-btn" onClick={() => navigate("/home")}>
          Return to Home Screen
        </button>
        <p className="pageCounter">{pageNumber} / 8</p>
      </div>
    </div>
  );
}
