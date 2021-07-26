
/**
 * Checks whether the game has been won by either player - STILL NEED TO HANDLE CONDITION FOR IF PLAYER CAN'T MOVE
*/
 const checkWinCondition = (setWinner, grid, numSquaresInLine) => {
    let blackPiecesRemaining = false;
    let yellowPiecesRemaining = false;

    for (let y = 0; y < numSquaresInLine; y++) {
        //If we are on a even row, the checkers start at position 1, otherwise position 0
        let startingPosition = (y % 2) === 0 ? 1 : 0;
        for (let x = startingPosition; x < numSquaresInLine; x += 2) {
            if (grid[y][x] === '1' || grid[y][x] === '3') {
                blackPiecesRemaining = true;
                if (yellowPiecesRemaining) return;
            } else if (grid[y][x] === '2' || grid[y][x] === '4') {
                yellowPiecesRemaining = true;
                if (blackPiecesRemaining) return;
            }
        }
    }

    if (!blackPiecesRemaining) {
        setWinner(2);
    } else if (!yellowPiecesRemaining) {
        setWinner(1);
    }
};

export default checkWinCondition;