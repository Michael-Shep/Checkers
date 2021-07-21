
const GridSquare = ({ row, col }) => {
    const getSquareColorClass = () => {
        if (row % 2 === 0) {
            if (col % 2 ===0) return 'whiteSquare';
            else return 'brownSquare';
        } else {
            if (col % 2 === 0) return 'brownSquare';
            else return 'whiteSquare';
        }
    };

    return (
        <div className={`gridSquare ${getSquareColorClass()}`}></div>
    );
};

export default GridSquare;