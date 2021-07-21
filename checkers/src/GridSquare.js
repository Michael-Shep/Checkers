
const GridSquare = ({ onClick, row, col, value, selected }) => {
    const getSquareColorClass = () => {
        if (row % 2 === 0) {
            if (col % 2 ===0) return 'whiteBackground';
            else return 'brownBackground';
        } else {
            if (col % 2 === 0) return 'brownBackground';
            else return 'whiteBackground';
        }
    };

    return (
        <div onClick={onClick} className={`gridSquare ${getSquareColorClass()} 
                                           ${selected ? 'selectedSquare' : ''}`}>
            {value !== '0' &&
                <div className={`checker ${value === '1' ? 'blackBackground' : 'yellowBackground'}`}>
                </div>
            }
        </div>
    );
};

export default GridSquare;