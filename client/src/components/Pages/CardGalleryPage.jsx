import { useState } from "react";
import { useParams } from "react-router";
import GalleryCard from "./CardGalleryComponents/GalleryCard/GalleryCard";
import GalleryPartition from "./CardGalleryComponents/GalleryPartition.jsx/GalleryPartition";
import useFetchGallery from "../../customHooks/useFetchGallery";
import sortUtils from "../../utils/sortingUtils";
import styles from "./CardGalleryPage.module.css";
import { COLOR_NAMES_MAP, COLOR_NAMES_ARRAY } from "../../utils/colorSort.js";

function CardGalleryPage() {
    const { userSetId } = useParams();
    const { reviews, setReviews, loading, error } = useFetchGallery(userSetId);
    const [ filter, setFilter ] = useState('none');
    const [ sort, setSort ] = useState('none'); 
    const [ partition, setPartition ] = useState('none'); 

    //create hide ratings button?

    if (error) {return <h1>error!</h1>}
    if (loading) { return <h1>Loading!</h1>}

    console.log(reviews);
    console.log(partition);

    function makeKeyColor(review) {
        let key = '';
    
        //make colorless cards their own color?
        if (review.faces[0].colors.length === 0 && review.faces[0].types.includes('Land')) {
            key = 'CC';
        } else {
            key = review.faces[0].colors.join(",");
        }

        return COLOR_NAMES_MAP[key];
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

    const RANK_ORDER = ['S', 'A', 'B', 'C', 'D', 'F', 'NR'];

    function makeKeyRarity(review) {
        return review.rarity; 
    }

    const RARITY_ORDER = ['common', 'uncommon', 'rare', 'mythic']; 

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

    function makeKeyNone(review) {
        return review; 
    }

    function filterRed(review) {
        return review.faces[0].colors.includes('R');
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

    function applyMechanisms(reviewData) {
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
                console.log("huh");
                break;
            default: 
                throw new Error("filter function fall through");
        }

        switch (partition) {
            case 'none':
                //refactor 
                makeKey = makeKeyNone;
                orderKeys=[];
                break;
            case 'color':
                makeKey = makeKeyColor; 
                orderKeys = COLOR_NAMES_ARRAY; 
                break;
            case 'cmc':
                makeKey = makeKeyCMC; 
                orderKeys = CMC_ORDER;
                break;
            case 'rank':
                makeKey = makeKeyRank; 
                orderKeys = RANK_ORDER;
                break;
            case 'rarity': 
                makeKey = makeKeyRarity; 
                orderKeys = RARITY_ORDER; 
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
            case 'rating':
                sortFunction = sortUtils.sortingByRating; 
                break;
            case 'rarity':
                sortFunction = sortUtils.sortingByRarity; 
                break;
            default: 
                throw new Error("you messed up");
        }

        const filteredReviews = filterReviews(reviewData, filterFunction);

        console.log(filteredReviews);

        const partitionedReviews = partitionReviews(filteredReviews, makeKey, orderKeys);
        const sortedReviews = sortReviews(partitionedReviews, sortFunction);

        console.log("sortedreviews");
        console.log(sortedReviews);

        return sortedReviews;
    }

    const partitionedReviews = applyMechanisms(reviews);    

    const displayReviews = partitionedReviews.map(reviewArray => {
        return <GalleryPartition key={reviewArray.key} userSetId={userSetId} name={reviewArray.key}>{reviewArray.items}</GalleryPartition>
    })

    function sortCards(method) {
        const copy = [...reviews];
        
        switch(method) {
            case 'color':
                copy.sort((a, b) => sortUtils.sortingByColor(a, b));
                break;
            case 'cmc': 
                copy.sort((a, b) => sortUtils.sortingByCMC(a, b)); 
                break;
            case 'rating':
                copy.sort((a, b) => sortUtils.sortingByRating(a, b)); 
                break;
            case 'rarity':
                copy.sort((a, b) => sortUtils.sortingByRarity(a, b)); 
                break;
            default: 
                copy.sort((a, b) => sortUtils.sortingByColor(a, b));
        }
        setReviews(copy);
    }


    return (
        <>
            <div className={styles.mechanisms}>
                <div>
                    <label htmlFor="partition">Partition:</label>
                    <select name="partition" id="sorting" value={partition} onChange={(e) => {
                        setPartition(e.target.value); }}>
                        <option default value="none">None</option>
                        <option value="color">By Color</option>
                        <option value="cmc">By CMC</option>
                        <option value="rank">By Rating</option>
                        <option value="rarity">By Rarity</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="sorting">Sort: </label>
                    <select name="sorting" id="sorting" value={sort} onChange={(e) => {
                        setSort(e.target.value); sortCards(e.target.value); }}>
                        <option default value="none">None</option>
                        <option value="color">By Color</option>
                        <option value="cmc">By CMC</option>
                        <option value="rating">By Rating</option>
                        <option value="rarity">By Rarity</option>
                    </select>
                </div>
                
                <div>
                    <label htmlFor="filtering">Filter: </label>
                    <select name="fitering" id="filtering" value={filter}  onChange={(e) => {
                        setFilter(e.target.value); }}>
                        <option default value="none">None</option>
                        <option value="color">By Red</option>
                    </select>
                </div>
            </div>

            {/*<div className={styles.cardContainer}>{displayReviews}</div> */}
            <div className={styles.partitionContainer}>{displayReviews}</div>
        </>
    );
}

export default CardGalleryPage;