import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import GalleryPartition from "./GalleryPartition.jsx/GalleryPartition";
import fetchGallery from "../../../queryFunctions/fetchGallery.js";
import styles from "./CardGalleryPage.module.css";
import { applyMechanisms } from "../../../utils/applyMechanisms.js"
import isEqual from 'lodash/isEqual';

function CardGalleryPage() {
    let { userSetId } = useParams();

    let location = useLocation(); 
    let navigate = useNavigate();

    userSetId = Number(userSetId);

    const params = new URLSearchParams(location.search); 
    const filter = params.has('filter') ? params.get('filter') : 'none';
    const sort = params.has('sort') ? params.get('sort') : 'none';
    const partition = params.has('partition') ? params.get('partition') : 'none';

    const queryClient = useQueryClient();

    //Cache the review data to be recompute SORTING ORDER quickly in the individual card page 
    const { data: reviews, isLoading, error } = useQuery({
        queryKey: ['cards', userSetId],
        queryFn: async () => fetchGallery(userSetId), 
        staleTime: 5 * 60 * 1000,
    });

    function setParams(mechanism, mechValue) {
        const params = new URLSearchParams(location.search);
        params.set(mechanism, mechValue);
        navigate(`?${params.toString()}`, { replace: true } );
    }

    const transformedReviews = useMemo(() => {
        if (!reviews) {
            return null; 
        }
        return applyMechanisms(reviews, filter, partition, sort);    
    }, [reviews, filter, partition, sort]) 

    
    useEffect(() => {
        if (!transformedReviews) return;

        const cacheKey = ['sortOrder', userSetId, filter, partition, sort];
        const alreadyCached = queryClient.getQueryData(cacheKey);

        if (!alreadyCached || !isEqual(alreadyCached, transformedReviews)) {
            queryClient.setQueryData(cacheKey, transformedReviews);
        }
    }, [transformedReviews, queryClient, userSetId, sort, filter, partition]);


    //create hide ratings button?
    if (error) {return <h1>error!</h1>}
    if (isLoading) { return <h1>Loading!</h1>}

    console.log(transformedReviews);

    const displayReviews = transformedReviews.map(reviewArray => {
        return <GalleryPartition key={reviewArray.key} userSetId={userSetId} name={reviewArray.key}>{reviewArray.items}</GalleryPartition>
    })

    return (
        <>
            <div className={styles.mechanisms}>
                <div>
                    <label htmlFor="partition">Partition:</label>
                    <select name="partition" id="sorting" value={partition} onChange={(e) => {
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
                    <select name="sorting" id="sorting" value={sort} onChange={(e) => { setParams('sort', e.target.value)}}>
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