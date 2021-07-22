import { useState } from 'react';
import { copy } from 'fastest-json-copy';

import GridSquare from "./GridSquare";

const Board = () => {
    const numSquaresInLine = 8;

    /**
     * Creates the starting grid used for checkers
     * @returns Grid of values 0, 1 and 2 - 0 means no checker, 1 means black 2 means white
     */
    const createStartingGrid = () => {
        let grid = [];
        //Create starting configuration for the checkers - 1 represnts black, 2 represents white
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
        if (takingMove && takenRow !== -1 && takenCol !== -1) {
            gridCopy[takenRow][takenCol] = '0';
        };
        setGrid(gridCopy);
        setSelectedPosition([]);
    };

    /**
     * Handles all the movement code for the checkers - MAY BE ABLE TO BE IMPROVED AS NOT TOO CLEAN CURRENTLY
     * @param {*} rowIndex The row of where the selected checker should be moved to
     * @param {*} columnIndex The col of where the selected checker should be moved to
     */
    const handleMovement = (rowIndex, columnIndex) => {
        //Handle standard movement - moving up or down 1 space diagonally
        if ((grid[selectedPosition[0]][selectedPosition[1]] === '1' && rowIndex === selectedPosition[0] + 1) || 
            (grid[selectedPosition[0]][selectedPosition[1]] === '2' && rowIndex === selectedPosition[0] - 1)) {
                if (columnIndex === selectedPosition[1] - 1 || columnIndex === selectedPosition[1] + 1) {
                    performMove(rowIndex, columnIndex);
                }
        }
        //Handle taking a piece to the bottom of the current selected checker
        else if((grid[selectedPosition[0]][selectedPosition[1]] === '1' && rowIndex === selectedPosition[0] + 2)) {
            //Bottom right
            if (columnIndex === selectedPosition[1] + 2 && grid[selectedPosition[0] + 1][selectedPosition[1] + 1] === '2') {
                performMove(rowIndex, columnIndex, true, selectedPosition[0] + 1, selectedPosition[1] + 1);
            } 
            //Bottom Left
            if (columnIndex === selectedPosition[1] - 2 && grid[selectedPosition[0] + 1][selectedPosition[1] - 1] === '2') {
                performMove(rowIndex, columnIndex, true, selectedPosition[0] + 1, selectedPosition[1] - 1);
            }
        }
        //Handle taking a piece to the top of the current selected checker
        else if((grid[selectedPosition[0]][selectedPosition[1]] === '2' && rowIndex === selectedPosition[0] - 2)) {
            //Top right
            if (columnIndex === selectedPosition[1] + 2 && grid[selectedPosition[0] - 1][selectedPosition[1] + 1] === '1') {
                performMove(rowIndex, columnIndex, true, selectedPosition[0] - 1, selectedPosition[1] + 1);
            } 
            //Top Left
            if (columnIndex === selectedPosition[1] - 2 && grid[selectedPosition[0] - 1][selectedPosition[1] - 1] === '1') {
                performMove(rowIndex, columnIndex, true, selectedPosition[0] - 1, selectedPosition[1] - 1);
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
        if (value !== '0') {
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

    return (
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
    );
};

export default Board;