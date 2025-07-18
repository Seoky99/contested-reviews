import { useState, useMemo, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router";
import { applyMechanisms } from "../../utils/applyMechanisms";
import { useQueryClient, useQuery } from "@tanstack/react-query";

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';

import styles from "./CardPage.module.css";
import useFetchReview from "../../customHooks/useFetchReview";
import ReviewTagList from "./CardPageComponents/Tag/ReviewTagList";
import TagPanel from "./CardPageComponents/Tag/TagPanel";
import TrophyModal from "./CardPageComponents/Trophy/TrophyModal/TrophyModal";
import TrophyDisplay from "./CardPageComponents/Trophy/TrophyDisplay/TrophyDisplay";
import Notes from "./CardPageComponents/Notes/Notes";
import RankWidget from "./CardPageComponents/RankWidget/RankWidget";
import fetchGallery from "../../queryFunctions/fetchGallery";


function CardPage() {
    let { userSetId, cardId, reviewId } = useParams(); 

    const location = useLocation();
    const params = new URLSearchParams(location.search);

    const sort = params.get('sort') ?? 'none';
    const filter = params.get('filter') ?? 'none';
    const partition = params.get('partition') ?? 'none';

    const { cardDetails, setCardDetails, 
            setTags, setSetTags, 
            selectedTags, setSelectedTags, 
            trophies, setTrophies,
            loading, error } = useFetchReview(reviewId); 
    const [ showPanel, setShowPanel ] = useState(false);
    const [ saving, setSaving ] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const queryClient = useQueryClient(); 

    userSetId = Number(userSetId);
    reviewId = Number(reviewId);

    const cachedSorted = queryClient.getQueryData(['sortOrder', userSetId, filter, partition, sort]);

    // Fallback fetch if cache is missing
    const {data: rawGallery, isLoading, error: galleryError} = useQuery({
            queryKey: ['cards', userSetId],
            queryFn: () => fetchGallery(userSetId),
            enabled: !cachedSorted,
        });

    // Compute sorted if not cached
    const sorted = useMemo(() => {
        if (cachedSorted) return cachedSorted;
        if (!rawGallery) return null;

        return applyMechanisms(rawGallery, filter, partition, sort);
    }, [cachedSorted, rawGallery, filter, partition, sort]);

    // Set query cache after reconstruction
    useEffect(() => {
        if (!cachedSorted && sorted) {
            queryClient.setQueryData(['sortOrder', userSetId, filter, partition, sort], sorted);
        }
    }, [cachedSorted, sorted, queryClient, filter, partition, sort, userSetId]);

    if (isLoading) { return <h1> Loading </h1>}
    if (galleryError) { return <h1> Error! </h1>}

    const sortOrder = [];
    sorted.forEach( partition => {
        partition.items.forEach( card => {
            sortOrder.push([card.faces[0].name, card.reviewId, card.cardId]);
        });
    })

    const myIndex = sortOrder.findIndex( review => review[1] === reviewId);
    
    const addQuestionMark = params.toString() === '' ? `` : `?`; 

    const nextCheck = myIndex >= sortOrder.length - 1 ? sortOrder[myIndex][1] :  sortOrder[myIndex + 1][1] ; 
    const prevCheck = myIndex <= 0 ? sortOrder[myIndex][1] : sortOrder[myIndex - 1][1]; 

    const nextCheckTwo = myIndex >= sortOrder.length - 1 ? sortOrder[myIndex][1] :  sortOrder[myIndex+1][2] ; 
    const prevCheckTwo = myIndex <= 0 ? sortOrder[myIndex][1] : sortOrder[myIndex-1][2]; 

    const nextUrl = `/setreviews/${userSetId}/reviews/${nextCheck}/cards/${nextCheckTwo}` + addQuestionMark + params.toString();
    const prevUrl = `/setreviews/${userSetId}/reviews/${prevCheck}/cards/${prevCheckTwo}` + addQuestionMark + params.toString();;

    if (loading) { return <h1>Loading</h1> }
    if (error) { return <h1>Error</h1>} 

    function toggleTag(tagId) {
        if (selectedTags.has(tagId)) {
            const newSet = new Set(selectedTags);
            newSet.delete(tagId);
            setSelectedTags(newSet); 
        } else {
            setSelectedTags(new Set(selectedTags).add(tagId)); 
        }
    }
    
    async function handleSaveClick() {
        setSaving(true);
        try {
            const url = `http://localhost:8080/api/reviews/${reviewId}`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                }, 
                body: JSON.stringify({rank: cardDetails.rank, notes: cardDetails.notes, selectedTags: Array.from(selectedTags), 
                                      userSetId: cardDetails.userSetId, trophies: trophies
                }),
            });

            const success = await response.json(); 
            
            await queryClient.invalidateQueries(['cards', userSetId]);

          
            const cacheKey = ['sortOrder', userSetId, filter, partition, sort];
            console.log(cacheKey);

            await queryClient.invalidateQueries(cacheKey);

            console.log(success); 
        } catch (err) {
            console.log(err); 
        } finally {
            setSaving(false); 
        }
    }

    async function handleDelete(reviewId, tagId) {
        try {
            const url = `http://localhost:8080/api/reviews/${reviewId}/tags/${tagId}`;
            const response = await fetch(url, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error("server error" + response.status);
            }
        } catch (err) {
            console.log(err); 
        }
    }

    function handleRankChange(e) { setCardDetails({...cardDetails, rank: e.target.value}); }
    function handleNotesChange(e) { setCardDetails({...cardDetails, notes: e.target.value}); }
    function openModal() {setIsModalOpen(true);}
    function closeModal() {setIsModalOpen(false);}

    reviewId = Number(reviewId);
    const reviewTags = setTags.filter(tag => selectedTags.has(tag.tagId));
    const reviewData = {review_id: cardDetails.reviewId, card_name: cardDetails.faces[0].name, image_normal: cardDetails.faces[0].imageNormal};
    const displayTrophies = trophies.filter(trophy => trophy.review_id === reviewId);


    const cardGalleryUrl = `/setreviews/${userSetId}/cards` + addQuestionMark + params.toString();

    return (
            
            <div className={styles.pageWrapper}>
                <div className={styles.tempWrap}>
                    <Link to={cardGalleryUrl} className={styles.navButton}> <CollectionsBookmarkIcon/> Card Gallery</Link> 
                    <h6 className={styles.mechs}>FILTER: {filter} &gt;&gt;&gt; PARTITION: {partition} &gt;&gt;&gt; SORT: {sort}</h6>
                </div>
                <div className={styles.cardWrapper}>

                    <div className={styles.cardRank}>
                        <img className={styles.cardImage} src={cardDetails.faces[0].borderCrop}></img>
                        <h1>{cardDetails.rank === null ? "NR" : cardDetails.rank}</h1>

                        <div className={styles.navButtonWrapper}>
                            <Link to={prevUrl} className={styles.navButton}><ArrowBackIcon/></Link> 
                            <h4>{myIndex+1}/{sortOrder.length}</h4>
                            <Link to={nextUrl} className={styles.navButton}><ArrowForwardIcon/></Link>
                        </div>
                    </div>

                    <div className={styles.cardInformation}>
                        <div className={styles.header}>
                            <h1>{cardDetails.faces[0].name}</h1>
                            <TrophyDisplay displayTrophies={displayTrophies} modalOnClick={openModal}></TrophyDisplay>
                            <TrophyModal isOpen={isModalOpen} onClose={closeModal} trophies={trophies} setTrophies={setTrophies} reviewData={reviewData}/>
                        </div>

                        <RankWidget rank={cardDetails.rank} handleRankChange={handleRankChange}/>
                        <Notes notesValue={cardDetails.notes} handleNotesChange={handleNotesChange}/>
                
                        <ReviewTagList reviewTags={reviewTags} handleDelete={handleDelete} selectedTags={selectedTags}
                                    toggleTag={toggleTag} reviewId={reviewId} showPanel={showPanel}/>
                    
                        <button className={styles.addTagButton} onClick={() => setShowPanel(!showPanel)}>Manage Tags {showPanel ? `▲` : `▼`}</button>

                        {showPanel && <TagPanel selectedTags={selectedTags} setSelectedTags={setSelectedTags}
                                                setTags={setTags} setSetTags={setSetTags} userSetId={cardDetails.userSetId}
                                                toggleTag={toggleTag}/>}
                        
                        {saving && <h4>Saving!</h4>}
                        <button type="submit" onClick={handleSaveClick} className={styles.saveButton}>Save</button>
                    </div>
                </div>
            </div>
    )
}

export default CardPage; 