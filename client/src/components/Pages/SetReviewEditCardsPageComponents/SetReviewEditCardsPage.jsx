import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import GalleryPartition from "../CardGalleryComponents/GalleryPartition.jsx/GalleryPartition.jsx";
import EditCard from "./EditCard.jsx";
import useFetchSetReviewCardsEdit from "../../../customHooks/useFetchSetReviewCardsEdit.js";
import styles from "./SetReviewEditCardsPage.module.css";
import { applyMechanisms } from "../../../utils/applyMechanisms.js";
import { useQueryClient } from '@tanstack/react-query';

function SetReviewEditCardsPage() {
    let { userSetId } = useParams();

    userSetId = Number(userSetId);

    let { cards, initiallySelected, setInitiallySelected, selected, setSelected, loading, error } = useFetchSetReviewCardsEdit(userSetId); 
    let location = useLocation(); 
    let navigate = useNavigate();

    const params = new URLSearchParams(location.search); 
    const filter = params.has('filter') ? params.get('filter') : 'none';
    const sort = params.has('sort') ? params.get('sort') : 'none';
    const partition = params.has('partition') ? params.get('partition') : 'none';

    function setParams(mechanism, mechValue) {
        const params = new URLSearchParams(location.search);
        params.set(mechanism, mechValue);
        navigate(`?${params.toString()}`, { replace: true } );
    }

    const queryClient = useQueryClient();

    const transformedReviews = useMemo(() => {
        if (!cards) {
            return null; 
        }
        return applyMechanisms(cards, filter, partition, sort);    
    }, [cards, filter, partition, sort]) 

    console.log(transformedReviews);

    if (error) { return <h1>error!</h1>}
    if (loading) { return <h1>Loading!</h1>}

    function toggleSelection(cardId) {
        const selectedCopy = new Set(selected);

        if (selectedCopy.has(cardId)) {
            selectedCopy.delete(cardId);
        } else {
            selectedCopy.add(cardId); 
        }

        setSelected(selectedCopy);
    }

    async function handleSaving() {
        const added = [...selected].filter(id => !initiallySelected.has(id));
        const removed = [...initiallySelected].filter(id => !selected.has(id));

        try {
            const url = `http://localhost:8080/api/setreviews/${userSetId}/cards/edit`;
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ added, removed}),
            });

            if (!response.ok) {
                throw new Error("server error" + response.status);
            }

            await queryClient.invalidateQueries(['cards', userSetId]);
            navigate(`/setreviews/${userSetId}/cards`);

        } catch (err) {
            console.log(err); 
        }
    }

    const renderChild = (review) => {
        return <EditCard key={review.cardId} cardData={review} selected={selected} toggleSelection={() => toggleSelection(review.cardId)}/>;
    }

    const displayReviews = transformedReviews.map(reviewArray => {
        return <GalleryPartition key={reviewArray.key} userSetId={userSetId} reviewArray={reviewArray} renderChild={renderChild}></GalleryPartition>
    });   

    return (
        <>
            <div className={styles.mechanisms}>

                <button className={styles.saveButton} onClick={handleSaving}>SAVE CHANGES</button>

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

            {<div className={styles.partitionContainer}>{displayReviews}</div>}
        </>
    );
}

export default SetReviewEditCardsPage;