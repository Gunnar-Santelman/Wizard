Wizard is a thrilling card game of bidding, testing your ability to plan ahead and react to changes as they come.

BASIC RULES: 
- Wizard is played in rounds, divided into tricks
- For the first round, 1 card is dealt to each player, and 1 trick is played
- Cards and tricks increase by 1 for every round until the whole deck is in play
- Players bid on the number of tricks they believe they can win, losing points for how far away they are, or gaining points if they nail their bid
- Every round, a card is cut up that will be the ‘trump’ suit, and every trick is played by each player placing a card, and the cards are valued in this order 
- Wizard card->Highest trump card->Highest card of the led suit->Jester

HOW TO START:
1. Install Docker Desktop
2. Open Docker Desktop and Sign in/Create an Account
3. Add .env file sent via Slack to the root of the project, and add the serviceAccountKey.json that was sent from Slack to the backend/wizard-backend folder
4. In terminal, run `docker compose up --build`
5. Open localhost:3000 in browsers, should be automatically placed on login screen
