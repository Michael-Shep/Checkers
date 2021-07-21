
const GridSquare = ({ row, col, value }) => {
    const handlePressEvent = () => {
        if (value !== '0') {
            console.log('Checker Pressed');
        }
    };

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
        <div onClick={handlePressEvent} className={`gridSquare ${getSquareColorClass()}`}>
            {value !== '0' &&
                <div className={`checker ${value === '1' ? 'blackBackground' : 'yellowBackground'}`}>
                </div>
            }
        </div>
    );
};

export default GridSquare;