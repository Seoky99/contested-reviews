import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, useLocation, Link } from "react-router";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { applyMechanisms } from "../../../utils/applyMechanisms.js"
import styles from "./CardGalleryPage.module.css";
import GalleryPartition from "./GalleryPartition.jsx/GalleryPartition";
import GalleryCard from "./GalleryCard/GalleryCard.jsx";
import fetchGallery from "../../../queryFunctions/fetchGallery.js";
import EditButton from "./EditButton/EditButton.jsx";
import isEqual from 'lodash/isEqual';
import Mechanisms from "./Mechanisms/Mechanisms.jsx";
import MechanismIcons from "./Mechanisms/MechanismIcons.jsx";
import SideBar from "./SideBar/SideBar.jsx";
import IconBar from "./IconBar/IconBar.jsx";
import ErrorPage from "../ErrorHandling/ErrorPage.jsx";

function CardGalleryPage() {
    let { userSetId } = useParams();

    let location = useLocation(); 
    let navigate = useNavigate();

    const [sideBarActive, setSideBarActive] = useState(true);
    const [showRatings, setShowRatings] = useState(true);

    userSetId = Number(userSetId);

    //TODO: Support multi-filtering by breaking up filter to (tag=tagName, color=colorValue instead)
    //This will require a cache redesign ... make it one key? 

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
    if (error) {return <ErrorPage error={error}/>}
    if (isLoading) { return <h1>Loading!</h1>}

    const renderChild = (review, userSetId) => {
        return <GalleryCard key={review.reviewId} reviewId={review.reviewId} 
                            cardData={review} userSetId={userSetId} showRatings={showRatings}/>;
    }

    const displayReviews = transformedReviews.map(reviewArray => {
        return <GalleryPartition key={reviewArray.key} userSetId={userSetId} reviewArray={reviewArray} renderChild={renderChild}></GalleryPartition>
    });   

    return (
            <div className={styles.pageWrapper}>
                {sideBarActive ? <SideBar shrinkBar={() => setSideBarActive(!sideBarActive)}>
                                    <Mechanisms filter={filter} sort={sort} partition={partition} setParams={setParams}/>
                                    <EditButton userSetId={userSetId} params={params}/>
                                    <button className={styles.ratingsButton} onClick={() => setShowRatings(!showRatings)}>{showRatings?'Hide Ratings':'Show Ratings'}</button>
                                </SideBar> : 
                                <IconBar expandBar={() => setSideBarActive(!sideBarActive)}>
                                    <MechanismIcons filter={filter} sort={sort} partition={partition}/>
                                 </IconBar> }
                <div className={styles.partitionContainer}>{displayReviews}</div>
            </div>
    );
}

export default CardGalleryPage;