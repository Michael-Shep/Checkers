
const GridSquare = ({ onClick, row, col, value, selected }) => {
    /**
     * Get the CSS class for the color that the square should use for its background
     * @returns Returns the name of the CSS class that should be used
     */
    const getSquareColorClass = () => {
        if (row % 2 === 0) {
            if (col % 2 ===0) return 'whiteBackground';
            else return 'brownBackground';
        } else {
            if (col % 2 === 0) return 'brownBackground';
            else return 'whiteBackground';
        }
    };

    /**
     * Gets the CSS class for the color that the checker on the square should be
     * @returns Returns the name of the CSS class that should be used
     */
    const getCheckerColorClass = () => {
        //1 represents standard black checker, 3 represents kinged black checker
        if (value === '1' || value === '3') {
            return 'blackBackground';
        }
        else {
            return 'yellowBackground';
        }
    };

    return (
        <div onClick={onClick} className={`gridSquare ${getSquareColorClass()} 
                                           ${selected ? 'selectedSquare' : ''}`}>
            {value !== '0' &&
                <div className={`checker ${getCheckerColorClass()}`}>
                    { //If the checker is kinged, draw a K on the checker
                    (value === '3' || value === '4') &&
                        <span id="kingedCheckerText">K</span>
                    }
                </div>
            }
        </div>
    );
};

export default GridSquare;