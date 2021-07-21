import { useState } from 'react';

import GridSquare from "./GridSquare";

const Board = () => {
    const numSquaresInLine = 8;

    const createStartingGrid = () => {
        let grid = [];
        //Start grid as empty
        for (let y = 0; y < numSquaresInLine; y++) {
            let gridRow = [];
            for (let x = 0; x < numSquaresInLine; x++) {
                gridRow.push('0');
            }
            grid.push(gridRow);
        }
        return grid;
    };

    const [grid, setGrid] = useState(createStartingGrid());

    return (
        <div id="board">
            {
                grid.map((row, rowIndex) => {
                    return (<div className="boardRow" key={`row${rowIndex}`}> 
                        {
                            row.map((_, columnIndex) => 
                                <GridSquare key={(rowIndex * numSquaresInLine) + columnIndex} 
                                            row={rowIndex} col={columnIndex}/>)
                        }
                    </div>);
                })
            }
        </div>
    );
};

export default Board;