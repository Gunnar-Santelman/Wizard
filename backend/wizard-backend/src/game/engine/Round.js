import WizardGame from "../WizardGame.js";
import Deck from "./Deck.js";
import Card from "./Card.js";
import Rules from "./Rules.js";
import Trick from "./Trick.js";

export default class Round {
  #dealer;
  #roundNumber;
  #currentPlayer;
  #trickNumber;
  #cutCard;
  #game;
  #deck;
  constructor(roundNumber, game) {
    this.#roundNumber = roundNumber;
    this.#game = game;
    // rotates dealer and sets player to the left of the dealer
    const dealerInd = (this.#roundNumber - 1) % this.#game.players.length;
    this.#dealer = this.#game.players[dealerInd];
    this.#currentPlayer =
      game.players[(dealerInd + 1) % this.#game.players.length];
    this.#trickNumber = 0;
    this.currentTrick = null;
    this.#deck = new Deck();
    if (roundNumber !== (60 / this.#game.players.length)) {
      this.#cutCard = this.#deck.cutCard();
    }
    else {
      this.#cutCard = null;
    }
    this.dealCards();
    this.trumpCard = (this.#cutCard !== null) ? new Card(this.#cutCard.suit, this.#cutCard.value) : null;
    this.winner = null;
  }
  get currentPlayer() {
    return this.#currentPlayer;
  }
  get roundNo() {
    return this.#roundNumber;
  }
  get currentPlayer() {
    return this.#currentPlayer;
  }
  get trump() {
    return Rules.determineTrump(this.#cutCard);
  }
  get cutCard() {
    return this.#cutCard;
  }
  /**
   * Sets the current dealer.
   * @param {Player} player the player object of the player.
   */
  setDealer(player) {
    this.#dealer = player;
  }
  determineTrumpInHand(hand) {
    for (let card of hand) {
      if (card && card.suit === this.trump) {
        card.trump = true;
      }
    }
  }
  /**
   * Sets the current player.
   * @param {Player} player player object of the desired player.
   */
  setCurrentPlayer(player) {
    this.#currentPlayer = player;
  }
  /**
   * Increments the trick number by 1.
   */
  incTrickNumber() {
    this.#trickNumber++;
  }
  /**
   * Deals n cards to the player depending on the round number.
   */
  dealCards() {
    for (const player of this.#reorderPlayers(this.#currentPlayer)) {
      for (let i = 0; i < this.#roundNumber; i++) {
        // im going to deal the cards 4 at a time to the players
        //  because I don't believe in the "this is my card" superstition
        player.hand.push(this.#deck.cutCard());
      }
      this.determineValidCards(player.hand);
      this.determineTrumpInHand(player.hand);
      player?.hand.sort(Card.orderCards);
    }
  }
  /**
   * collects bids for the round
   */
  collectBids() {
    for (const player of this.#reorderPlayers(this.#currentPlayer)) {
      // offer player bid choice 0-round number
      // player.setbid(choice)
    }
  }
  /**
   * Helper function to reorder play within a round.
   * @param {Player} start
   * @returns a player array ordered through the leading player.
   */
  #reorderPlayers(start) {
    const players = this.#game.players;
    const index = players.indexOf(start);
    // this splits the array at the index, then appends the rest before it so it wraps around
    return [...players.slice(index), ...players.slice(0, index)];
  }

  determineValidCards() {
    for (const player of this.#game.players) {
      const hand = player?.hand;
      for (let i = 0; i < hand.length; i++) {
        const card = hand[i];
        if (card && Rules.isValidPlay(card, hand, this.currentTrick?.ledCard?.suit)) {
          card.isValid = true;
        }
        else if (card){
          card.isValid = false;
        }
      }
    }
  }

  moveToNextPlayer() {
    this.winner = null;
    const players = this.#reorderPlayers(this.#currentPlayer);
    const currentIndex = players.indexOf(this.#currentPlayer);
    const nextIndex = (currentIndex + 1) % players.length;
    this.#currentPlayer = players[nextIndex];
  }

  playCard(socketId, cardIndex) {
    const player = this.#game.players.find((p) => p.socketId === socketId);
    if (!player) {
      return;
    }

    if (player !== this.#currentPlayer) {
      return;
    }

    const card = player.hand[cardIndex];
    if (!card || !card.isValid) {
      return;
    }

    player.playCard(card);

    if (!this.currentTrick) {
      this.currentTrick = new Trick(this.trump);
    }
    if (!this.currentTrick.ledCard) {
      this.currentTrick.setLed(card);
    }

    this.currentTrick.addCard(card, socketId);
    if (this.currentTrick.cards.length === this.#game.players.length) {
      this.finishTrick();
      return;
    }
    this.moveToNextPlayer();
    this.determineValidCards();
  }

  finishTrick() {
    const result = Rules.determineTrickWinner(this.currentTrick);
    const winner = this.#game.players.find((p) => p.socketId === result.player);
    this.winner = winner;
    this.#currentPlayer = winner;
    this.#trickNumber++;
    this.currentTrick = null;

    this.determineValidCards();
  }
}
