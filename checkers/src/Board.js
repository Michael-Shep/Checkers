import { useState } from 'react';

import GridSquare from "./GridSquare";

const Board = () => {
    const numSquaresInLine = 8;

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
    const [firstSelectedPosition, setFirstSelectedPosition] = useState([]);

    const onClickHandler = (value, rowIndex, columnIndex) => {
        //If we have not yet selected a position, make this square the first selected position
        if (value !== '0' && firstSelectedPosition.length === 0) {
            setFirstSelectedPosition([rowIndex, columnIndex]);
        }
    };

    const isSquareSelected = (rowIndex, colIndex) => {
        return firstSelectedPosition.length > 0 && firstSelectedPosition[0] === rowIndex 
               && firstSelectedPosition[1] === colIndex;
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