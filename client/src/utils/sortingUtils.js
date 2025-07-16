const colorRank = {
    'W': 1, 
    'U': 2, 
    'B': 3, 
    'R': 4,
    'G': 5
}

function sortingByCMC(a, b) {

    /*if (a.cmc === b.cmc) {
        return sortingByColor(a, b);
    } */

    return a.cmc - b.cmc; 
}

function sortingByColor(a, b) {

    //safety check in case scryfall somehow decides to change ordering of .colors
    let colorsA = [...a.faces[0].colors].sort((c, d) => colorRank[c] - colorRank[d]); 
    let colorsB = [...b.faces[0].colors].sort((c, d) => colorRank[c] - colorRank[d]);

    if (colorsA.length !== colorsB.length) {
        return colorsA.length - colorsB.length;
    }

    let length = Math.max(colorsA.length, colorsB.length);

    for (let i = 0; i < length; i++) {

        if (colorsA[i] === undefined) { return -1; }
        if (colorsB[i] === undefined) { return 1; }

        let candidateA = colorRank[colorsA[i]]; 
        let candidateB = colorRank[colorsB[i]];

        if (candidateA !== candidateB) {
            return candidateA - candidateB;
        }
    }

    return 0; 
}

//TODO: FINISH
function sortingByRating(a, b) {

    const ratingMap = {
        "S": 0, 
        "A": 1,
        "B": 2, 
        "C": 3, 
        "D": 4, 
        "F": 5
    }

    return ratingMap[a.rank] - ratingMap[b.rank]; 
}

function sortingByRarity(a, b) {

    const rarityMap = {
        "mythic": 0,
        "rare": 1, 
        "uncommon": 2, 
        "common": 3
    }

    console.log(a.rarity);

    return rarityMap[b.rarity] - rarityMap[a.rarity];

}

export default { sortingByCMC, sortingByColor, sortingByRating, sortingByRarity };
