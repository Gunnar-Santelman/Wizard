class Scoring{
    #scores={};
    #game;
    constructor(game)
    {
        this.#game=game;
        // initialize our nested map 
        this.initScoreboard();
    }
    initScoreboard(){
        for(const player of this.#game.players)
        {
            this.#scores[player]={
                total:0,
                rounds:[],
                bids:[],
                tricks:[],
            }
        }
    }
    updateScore(player,bid,taken)
    {
        this.#scores[player].bids.push(bid);
        this.#scores[player].tricks.push(taken);
        if(bid!=taken)
        {
            // 10 per trick wrong
            const score=10*(-Math.abs(bid-taken));
            this.#scores[player].total+=score;
            this.#scores[player].rounds.push(score);
        }
        else{
            // 20 for being correct plus 10 per trick taken
            const score=20+(10*taken);
            this.#scores[player].total+=score;
            this.#scores[player].rounds.push(score);
        }
    }
    /**
     * returns the nested map of the scoreboard
     */
    get scores(){return this.#scores};
}