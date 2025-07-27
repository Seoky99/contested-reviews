import PK from "./partitionKeys";
import PO from "./partitionOrders";
import sortUtils from "./sortingUtils";
import filterUtils from "./filterUtils";

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

function applyMechanisms(reviewData, filter, partition, sort) {
    //apply partition first 
    let makeKey; 
    let orderKeys; 
    let filterFunction; 
    let sortFunction; 

    //TEMPORARY way to support filtering by tags before implementing multi tags 
    const filterSplit = filter.split(":"); 
    let tagValue = "";

    if (filterSplit.length >= 1) {
        tagValue = filterSplit[1];
        filter = filterSplit[0];
    }

    switch (filter) {
        case 'none':
            filterFunction = (review) => review;
            break; 
        case 'white':
            filterFunction = (review) => filterUtils.filterByMonocolor(review, 'W'); 
            break;       
        case 'blue':
            filterFunction = (review) => filterUtils.filterByMonocolor(review, 'U'); 
            break;       
        case 'black':
            filterFunction = (review) => filterUtils.filterByMonocolor(review, 'B'); 
            break;       
        case 'red':
            filterFunction = (review) => filterUtils.filterByMonocolor(review, 'R'); 
            break;
        case 'green':
            filterFunction = (review) => filterUtils.filterByMonocolor(review, 'G'); 
            break;
        case 'multicolor':
            filterFunction = (review) => filterUtils.filterByMulticolor(review); 
            break;
        case 'hasTag':
            filterFunction = (review) => filterUtils.filterByTagExists(review); 
            break;
        case 'mainset':
            filterFunction = (review) => filterUtils.filterByMainSet(review); 
            break;
        case 'bonus':
            filterFunction = (review) => filterUtils.filterByBonus(review); 
            break;
        case 'tag': 
            filterFunction = (review) => filterUtils.filterByTag(review, tagValue); 
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