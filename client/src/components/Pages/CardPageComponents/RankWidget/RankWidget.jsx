function RankWidget({rank, handleRankChange}) {
    return (
        <select name="rank" value={rank === null ? "NR" : `${rank}`} onChange={handleRankChange}>
            <option value="NR">NR</option>
            <option value="D">D</option>
            <option value="C">C</option>
            <option value="B">B</option>
            <option value="A">A</option>
        </select>
    );
}

export default RankWidget;