import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import GalleryPartition from "./CardGalleryComponents/GalleryPartition.jsx/GalleryPartition";
import sortUtils from "../../utils/sortingUtils";
import fetchGallery from "../../queryFunctions/fetchGallery.js";
import styles from "./CardGalleryPage.module.css";
import PK from "../../utils/partitionKeys.js";
import PO from "../../utils/partitionOrders.js";

function CardGalleryPage() {
    const { userSetId } = useParams();
    //const { reviews, setReviews, loading, error } = useFetchGallery(userSetId);
    
    const { data: reviews, isLoading, error } = useQuery({
        queryKey: ['cards', userSetId],
        queryFn: async () => fetchGallery(userSetId), 
        staleTime: 5 * 60 * 1000
    });
    
    let location = useLocation(); 
    let navigate = useNavigate();

    const params = new URLSearchParams(location.search); 
    const filter = params.has('filter') ? params.get('filter') : 'none';
    const sort = params.has('sort') ? params.get('sort') : 'none';
    const partition = params.has('partition') ? params.get('partition') : 'none';

    //create hide ratings button?
    if (error) {return <h1>error!</h1>}
    if (isLoading) { return <h1>Loading!</h1>}

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
        const partitionedReviews = partitionReviews(filteredReviews, makeKey, orderKeys);
        const sortedReviews = sortReviews(partitionedReviews, sortFunction);
        console.log(sortedReviews);
        return sortedReviews;
    }

    function setParams(mechanism, mechValue) {
        const params = new URLSearchParams(location.search);
        params.set(mechanism, mechValue);
        navigate(`?${params.toString()}`, { replace: true } );
    }

    const partitionedReviews = applyMechanisms(reviews);    
    const displayReviews = partitionedReviews.map(reviewArray => {
        return <GalleryPartition key={reviewArray.key} userSetId={userSetId} name={reviewArray.key}>{reviewArray.items}</GalleryPartition>
    })

    return (
        <>
            <div className={styles.mechanisms}>
                <div>
                    <label htmlFor="partition">Partition:</label>
                    <select name="partition" id="sorting" onChange={(e) => {
                        setParams('partition', e.target.value)}}>
                        <option default value="none">None</option>
                        <option value="color">By Color</option>
                        <option value="cmc">By CMC</option>
                        <option value="rank">By Rating</option>
                        <option value="rarity">By Rarity</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="sorting">Sort: </label>
                    <select name="sorting" id="sorting" onChange={(e) => { setParams('sort', e.target.value)}}>
                        <option default value="none">None</option>
                        <option value="color">By Color</option>
                        <option value="cmc">By CMC</option>
                        <option value="rating">By Rating</option>
                        <option value="rarity">By Rarity</option>
                    </select>
                </div>
                
                <div>
                    <label htmlFor="filtering">Filter: </label>
                    <select name="fitering" id="filtering" value={filter}  onChange={(e) => { setParams('filter', e.target.value)}}>
                        <option default value="none">None</option>
                        <option value="color">By Red</option>
                    </select>
                </div>
            </div>

            <div className={styles.partitionContainer}>{displayReviews}</div>
        </>
    );
}

export default CardGalleryPage;