import { useEffect, useState } from 'react';
import { copy } from 'fastest-json-copy';

import GridSquare from "./GridSquare";
import checkWinCondition from "../helpers/WinCheckHandler";

const Board = () => {
    const numSquaresInLine = 8;

    /**
     * Creates the starting grid used for checkers
     * @returns Grid of values 0, 1 and 2 - 0 means no checker, 1 means black 2 means yellow
     * 3 means kinged black piece, 4 means kinged yellow
     */
    const createStartingGrid = () => {
        let grid = [];
        for (let y = 0; y < numSquaresInLine; y++) {
            let gridRow = [];
            for (let x = 0; x < numSquaresInLine; x++) {
                if (((y === 0 || y === 2) && x % 2 === 1) || (y === 1 && x % 2 === 0))
                    gridRow.push('1');
                else if (((y === 5 || y === 7) && x % 2 === 0) || (y === 6 && x % 2 === 1))
                    gridRow.push('2');
                else
                    gridRow.push('0');
            }
            grid.push(gridRow);
        }
        return grid;
    };

    const [grid, setGrid] = useState(createStartingGrid());
    const [selectedPosition, setSelectedPosition] = useState([]);
    const [player1Turn, setPlayer1Turn] = useState(true);
    const [winner, setWinner] = useState(-1);

    useEffect(() => checkWinCondition(setWinner, grid, numSquaresInLine), [grid]);

    /**
     * Moves a checker from the selected position into the newly selected position
     * @param {*} newRow The row the checker should be moved to
     * @param {*} newCol The column the checker should be moved to
     * @param {*} takingMove Whether the performed move is one which takes one of the opponents pieces
     * @param {*} takenRow The row of the piece that should be taken 
     * @param {*} takenCol The col of the piece that should be taken
     */
    const performMove = (newRow, newCol, takingMove = false, takenRow = -1, takenCol = -1) => {
        let gridCopy = copy(grid);
        gridCopy[newRow][newCol] = grid[selectedPosition[0]][selectedPosition[1]];
        gridCopy[selectedPosition[0]][selectedPosition[1]] = '0';
        //If the checker was not yet kinged and it has reached the top or bottom of the board, make it kinged
        if (newRow === 0 || newRow === numSquaresInLine - 1) {
            if (gridCopy[newRow][newCol] === '1') {
                gridCopy[newRow][newCol] = '3';
            } else if (gridCopy[newRow][newCol] === '2') {
                gridCopy[newRow][newCol] = '4';
            }
        }

        //Handle remove the enemy checker that has been taken from the board
        if (takingMove && takenRow !== -1 && takenCol !== -1) {
            gridCopy[takenRow][takenCol] = '0';
        };
        setGrid(gridCopy);
        setSelectedPosition([]);
        setPlayer1Turn(!player1Turn);
    };

    const isSelectedCheckerValue = (value) => {
        return grid[selectedPosition[0]][selectedPosition[1]] === value;
    };

    /**
     * Gets whether the selected checker is black - has value 1 or 3
     */
    const isBlackCheckerSelected = () => {
        return isSelectedCheckerValue('1') || isSelectedCheckerValue('3');
    };

    /**
     * Gets whether the selected checker is yellow - has value 2 or 4
     */
    const isYellowCheckerSelected = () => {
        return isSelectedCheckerValue('2') || isSelectedCheckerValue('4');
    };

    /**
     * Gets whether the selected checker is a king - has value 3 or 4
     */
    const isSelectedCheckerKing = () => {
        return isSelectedCheckerValue('3') || isSelectedCheckerValue('4');
    };

    /**
     * Checks whether a specific taking move can be performed and if so, performs it
     * @param {*} columnOffset The column to be checked in relation to the current position of the checker
     * @param {*} rowIndex The row of the checker
     * @param {*} columnIndex The column of the checker
     * @param {*} yEnemyOffset The row which we are checking for an enemy at
     * @param {*} xEnemyOffset The column which we are checking for an enemy at
     * @param {*} enemyColor Whether the enemy is BLACK or YELLOW
     */
    const checkAndPerformTakingMove = (columnOffset, rowIndex, columnIndex, yEnemyOffset, xEnemyOffset, enemyColor) => {
        let enemyAtPosition = false;
        if (enemyColor.toUpperCase() === 'BLACK') {
            enemyAtPosition = grid[selectedPosition[0] + yEnemyOffset][selectedPosition[1] + xEnemyOffset] === '1' ||
                              grid[selectedPosition[0] + yEnemyOffset][selectedPosition[1] + xEnemyOffset] === '3';
        }
        else if(enemyColor.toUpperCase() === 'YELLOW') {
            enemyAtPosition = grid[selectedPosition[0] + yEnemyOffset][selectedPosition[1] + xEnemyOffset] === '2' ||
                              grid[selectedPosition[0] + yEnemyOffset][selectedPosition[1] + xEnemyOffset] === '4';
        }

        if (enemyAtPosition && columnIndex === selectedPosition[1] + columnOffset) {
            performMove(rowIndex, columnIndex, true, selectedPosition[0] + yEnemyOffset, selectedPosition[1] + xEnemyOffset);
        }
    };

    /**
     * Handles all the movement code for the checkers - MAY BE ABLE TO BE IMPROVED AS NOT TOO CLEAN CURRENTLY
     * @param {*} rowIndex The row of where the selected checker should be moved to
     * @param {*} columnIndex The col of where the selected checker should be moved to
     */
    const handleMovement = (rowIndex, columnIndex) => {
        //Handle standard movement - moving up or down 1 space diagonally
        if (((isBlackCheckerSelected() || isSelectedCheckerKing()) && rowIndex === selectedPosition[0] + 1) || 
            ((isYellowCheckerSelected() || isSelectedCheckerKing()) && rowIndex === selectedPosition[0] - 1)) {
            if (columnIndex === selectedPosition[1] - 1 || columnIndex === selectedPosition[1] + 1) {
                performMove(rowIndex, columnIndex);
            }
       }
        //Handle standard black piece movement for taking a checker
        else if (isBlackCheckerSelected()) {
            if (rowIndex === selectedPosition[0] + 2) {
                checkAndPerformTakingMove(2, rowIndex, columnIndex, 1, 1, 'YELLOW');
                checkAndPerformTakingMove(-2, rowIndex, columnIndex, 1, -1, 'YELLOW');
            }
            else if(isSelectedCheckerKing() && rowIndex === selectedPosition[0] - 2) {
                checkAndPerformTakingMove(2, rowIndex, columnIndex, -1, 1, 'YELLOW');
                checkAndPerformTakingMove(-2, rowIndex, columnIndex, -1, -1, 'YELLOW');
            }
        }
        //Handle standard yellow piece movement for taking a checker
        else if(isYellowCheckerSelected()) {
            if (rowIndex === selectedPosition[0] - 2) {
                checkAndPerformTakingMove(2, rowIndex, columnIndex, -1, 1, 'BLACK');
                checkAndPerformTakingMove(-2, rowIndex, columnIndex, -1, -1, 'BLACK');
            }
            else if(isSelectedCheckerKing() && rowIndex === selectedPosition[0] + 2) {
                checkAndPerformTakingMove(2, rowIndex, columnIndex, 1, 1, 'BLACK');
                checkAndPerformTakingMove(-2, rowIndex, columnIndex, 1, -1, 'BLACK');
            }
        }
    };

    /**
     * Handles the click event for one of the grid positions
     * @param {*} value The checker value currently at that position
     * @param {*} rowIndex The row of the square that was pressed
     * @param {*} columnIndex The column of the square that was pressed
     */
    const onClickHandler = (value, rowIndex, columnIndex) => {
        if ((((value === '1' || value === '3') && player1Turn) || 
             ((value === '2' || value === '4') && !player1Turn)) && winner === -1) {
            setSelectedPosition([rowIndex, columnIndex]);
        }
        //If we already have a checker selected and then select an empty space, see if we can move to that space
        else if (value === '0' && selectedPosition.length === 2) {
            handleMovement(rowIndex, columnIndex);
        }
    };

    /**
     * Checks whether a given square is the one that has been selected on the grid
     * @param {*} rowIndex The row of the square to check
     * @param {*} colIndex The column of the square to check
     * @returns Boolean representing whether this square is selected or not
     */
    const isSquareSelected = (rowIndex, colIndex) => {
        return selectedPosition.length > 0 && selectedPosition[0] === rowIndex 
               && selectedPosition[1] === colIndex;
    };

    /**
     * Gets the text that should be displayed for each player's turn - will also display the winner when there is one
     * @returns A div containing the text that should be displayed
     */
    const getTurnText = () => {
        let outputText = '';
        if (winner !== -1) {
            outputText = `Player ${winner} Wins`;
        } else {
            outputText = `Player ${player1Turn ? '1' : '2'}'s Turn ${player1Turn ? '(Black)' : '(Yellow)'}`
        }
        return <div id="turnText">{outputText}</div>;
    };

    return (
        <div>
            {getTurnText()}
            <div id="board">
                {
                    grid.map((row, rowIndex) => {
                        return (<div className="boardRow" key={`row${rowIndex}`}> 
                            {
                                row.map((value, columnIndex) => 
                                    <GridSquare onClick={() => onClickHandler(value, rowIndex, columnIndex)} 
                                                key={(rowIndex * numSquaresInLine) + columnIndex} 
                                                row={rowIndex} col={columnIndex} value={value} 
                                                selected={isSquareSelected(rowIndex, columnIndex)}/>)
                            }
                        </div>);
                    })
                }
            </div>
        </div>
    );
};

export default Board;