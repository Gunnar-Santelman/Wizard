export default class Scoring{
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
            this.#scores[player.socketId]={
                total:0,
                rounds:[],
                bids:[],
                tricks:[],
            }
        }
    }
    updateScore(player,bid,taken)
    {
        this.#scores[player.socketId].bids.push(bid);
        this.#scores[player.socketId].tricks.push(taken);
        if(bid!=taken)
        {
            // 10 per trick wrong
            const score=10*(-Math.abs(bid-taken));
            this.#scores[player.socketId].total+=score;
            this.#scores[player.socketId].rounds.push(score);
        }
        else{
            // 20 for being correct plus 10 per trick taken
            const score=20+(10*taken);
            this.#scores[player.socketId].total+=score;
            this.#scores[player.socketId].rounds.push(score);
        }
    }
    /**
     * returns the nested map of the scoreboard
     */
    get scores(){return this.#scores};
}