import PK from "./partitionKeys";
import PO from "./partitionOrders";
import sortUtils from "./sortingUtils";

function partitionReviews(reviews, makeKey, orderKeys) {
    const partitionMap = new Map(); 

    if (orderKeys.length === 0) {
        return[{key: 'None', items: reviews}];
    }

    orderKeys.forEach(key => {
        partitionMap.set(key, []);
    })

    reviews.forEach(review => {
        const key = makeKey(review);

        if (!partitionMap.has(key)) {
            partitionMap.set(key, []);
        }
        partitionMap.get(key).push(review);
    });

    const data = []; 

    //sort partition on a specific order 
    for (const orderKey of orderKeys) {
        const dataEntry = { key: orderKey, items: partitionMap.get(orderKey) };
        data.push(dataEntry);
    }

    return data; 
}

function filterReviews(reviews, filterFunction) {
    const filteredReviews = reviews.filter(filterFunction); 
    return filteredReviews;
}

function sortReviews(reviews, sortFunction) {
    const sorted = reviews.map( reviewArray => {

        const copy = [...reviewArray.items];
        copy.sort((a, b) => sortFunction(a, b)); 
        return {...reviewArray, items: copy}; 
    });
    return sorted; 
}

function filterRed(review) {
    return review.faces[0].colors.includes('R');
}

function applyMechanisms(reviewData, filter, partition, sort) {
    //apply partition first 
    let makeKey; 
    let orderKeys; 
    let filterFunction; 
    let sortFunction; 

    switch (filter) {
        case 'none':
            filterFunction = (review) => review;
            break; 
        case 'color':
            filterFunction = filterRed; 
            break;
        default: 
            throw new Error("filter function fall through");
    }

    switch (partition) {
        case 'none':
            makeKey = PK.makeKeyNone;
            orderKeys=[];
            break;
        case 'color':
            makeKey = PK.makeKeyColor; 
            orderKeys = PO.COLOR_NAMES_ARRAY; 
            break;
        case 'cmc':
            makeKey = PK.makeKeyCMC; 
            orderKeys = PO.CMC_ORDER;
            break;
        case 'rank':
            makeKey = PK.makeKeyRank; 
            orderKeys = PO.RANK_ORDER;
            break;
        case 'rarity': 
            makeKey = PK.makeKeyRarity; 
            orderKeys = PO.RARITY_ORDER; 
            break; 
        default:
            throw new Error("You shouldn't be here");
    }

    switch (sort) {
        case 'none': 
            sortFunction = (a, b) => (a - b);
            break;
        case 'color': 
            sortFunction = sortUtils.sortingByColor;
            break;
        case 'cmc':
            sortFunction = sortUtils.sortingByCMC;
            break;
        case 'rank':
            sortFunction = sortUtils.sortingByRating; 
            break;
        case 'rarity':
            sortFunction = sortUtils.sortingByRarity; 
            break;
        case 'CN':
            sortFunction = sortUtils.sortingByCN;
            break;
        default: 
            throw new Error("you messed up");
    }

    const filteredReviews = filterReviews(reviewData, filterFunction);
    const partitionedReviews = partitionReviews(filteredReviews, makeKey, orderKeys);
    const sortedReviews = sortReviews(partitionedReviews, sortFunction);
    return sortedReviews;
}

export {applyMechanisms};