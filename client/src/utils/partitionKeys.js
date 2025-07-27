import PO from "./partitionOrders"; 
   
function makeKeyNone(review) {
    return review; 
}

function makeKeyColor(review) {
    let key = '';

    //make colorless cards their own color?
    if (review.faces[0].colors.length === 0) {
        key = 'CC';
    } else {
        key = review.faces[0].colors.join(",");
    }

    return PO.COLOR_NAMES_MAP[key];
}

function makeKeyCMC(review) {
    return review.cmc;
}

const CMC_ORDER=[];
for (let i = 0; i < 16; i++) {
    CMC_ORDER.push(i);
}

function makeKeyRank(review) {
    if (review.rank === null || review.rank === 'NR') {
        return 'NR'; 
    }

    return review.rank; 
}

function makeKeyRarity(review) {
    return review.rarity; 
}


export default { makeKeyNone, makeKeyColor, makeKeyCMC, makeKeyRank, makeKeyRarity}; 