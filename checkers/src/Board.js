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
     */
    const performMove = (newRow, newCol) => {
        let gridCopy = copy(grid);
        gridCopy[newRow][newCol] = grid[selectedPosition[0]][selectedPosition[1]];
        gridCopy[selectedPosition[0]][selectedPosition[1]] = '0';
        setGrid(gridCopy);
        setSelectedPosition([]);
    }

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
            //Handle standard movement - moving up or down 1 space diagonally
            if ((grid[selectedPosition[0]][selectedPosition[1]] === '1' && rowIndex === selectedPosition[0] + 1) || 
                (grid[selectedPosition[0]][selectedPosition[1]] === '2' && rowIndex === selectedPosition[0] - 1)) {
                    if (columnIndex === selectedPosition[1] - 1 || columnIndex === selectedPosition[1] + 1) {
                        performMove(rowIndex, columnIndex);
                    }
            }
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