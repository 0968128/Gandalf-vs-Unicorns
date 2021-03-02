/// <reference path="knight.ts" />
/// <reference path="tile.ts" />

class GameAI {
    public static treeHeight: number = 7;
    public static bestMove: [number, number];
    public static movingKnight: number;

    public static moveKnight(king:King, knights:Knight[], gameState:GameState) {
        let t0 = performance.now();

        // Call the minimax function to start the AI
        this.minimax(this.treeHeight, true, gameState, Infinity, -Infinity, king, knights);

        knights[this.movingKnight].setPosition(this.bestMove);
        gameState.knightPositions[this.movingKnight] = this.bestMove;

        let t1 = performance.now();
        console.log("AI move took " + (t1 - t0) + " milliseconds.");
    }
    
    public static minimax(treeHeight: number, isMax: boolean, gameState: GameState, alpha: number, beta: number, king: King, knights: Knight[]): number {
        let score = gameState.getScore();

        if(score[1] || treeHeight === 0) {
            return score[0];
        }
        
        if (isMax) {
            let best = -Infinity
            knights.forEach((knight, knightIndex) => {
                let validMoves = knight.getMoves(gameState.knightPositions[knightIndex]);
                for(let i = 0; i < validMoves.length; i++) {
                    let gameStateCopy = gameState.copy();
                    gameStateCopy.knightPositions[knightIndex] = validMoves[i];

                    let moveValue = this.minimax(treeHeight - 1, false, gameStateCopy, alpha, beta, king, knights);

                    if(treeHeight === this.treeHeight && moveValue > best) {
                        this.movingKnight = knightIndex;
                        this.bestMove = gameStateCopy.knightPositions[knightIndex];
                    }

                    alpha = Math.max(alpha, moveValue);
                    if(beta >= alpha) {
                        break;
                    }

                    best = Math.max(best, moveValue);
                }
            })

            return best;
        } else {
            let worst = Infinity;
            let validMoves = king.getMoves(gameState.kingPos);
            for(let i = 0; i < validMoves.length; i++) {
                let gameStateCopy = gameState.copy();
                gameStateCopy.kingPos = validMoves[i];

                let moveValue = this.minimax(treeHeight - 1, true, gameStateCopy, alpha, beta, king, knights);
                
                beta = Math.min(beta, moveValue);
                if(beta >= alpha) {
                    break;
                }
                
                worst = Math.min(worst, moveValue);
            }

            return worst;
        }
    }
}