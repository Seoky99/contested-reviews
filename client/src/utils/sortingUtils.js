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

function sortingByRating(a, b) {
    const ratingMap = {
        "S+": 0,
        "S": 1,
        "S-": 2,
        "A+": 3,
        "A": 4,
        "A-": 5,
        "B+": 6,
        "B": 7,
        "B-": 8,
        "C+": 9,
        "C": 10,
        "C-": 11,
        "D+": 12,
        "D": 13,
        "D-": 14,
        "F+": 15,
        "F": 16,
        "F-": 17,
        "NR": 18
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
    return rarityMap[b.rarity] - rarityMap[a.rarity];
}

export default { sortingByCMC, sortingByColor, sortingByRating, sortingByRarity };
