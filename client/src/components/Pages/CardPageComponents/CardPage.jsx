import { useState, useMemo, useEffect } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router";
import { applyMechanisms } from "../../../utils/applyMechanisms.js";
import { useQueryClient, useQuery } from "@tanstack/react-query";

import styles from "./CardPage.module.css";
import { SaveButton, HideRatingsButton, TagPanelButton } from "./Buttons/Buttons.jsx";
import axiosPrivate from "../../../customHooks/store/useAxiosPrivate.js";
import useFetchReview from "../../../customHooks/useFetchReview.js";
import ReviewTagList from "./Tag/ReviewTagList.jsx";
import TagPanel from "./Tag/TagPanel.jsx";
import TrophyModal from "./Trophy/TrophyModal/TrophyModal.jsx";
import TrophyDisplay from "./Trophy/TrophyDisplay/TrophyDisplay.jsx";
import Notes from "./Notes/Notes.jsx";
import RankWidget from "./RankWidget/RankWidget.jsx";
import fetchGallery from "../../../queryFunctions/fetchGallery.js";
import navTools from "../../../utils/cardNavigation.js";
import ReviewCard from "./ReviewCard/ReviewCard.jsx";
import ArrowBackIosTwoToneIcon from '@mui/icons-material/ArrowBackIosTwoTone';
import ErrorPage from "../ErrorHandling/ErrorPage.jsx";

function CardPage() {
    let { userSetId, /*cardId,*/ reviewId } = useParams(); 

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
    const [ deleteTagError, setDeleteTagError ] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showRatings, setShowRatings] = useState(true);

    console.log(selectedTags);

    //Save States: 'idle', 'saving', 'success', 'error' 
    const [ saving, setSaving ] = useState('idle');

    const queryClient = useQueryClient(); 
    const navigate = useNavigate();

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
    sorted.forEach(partition => {
        partition.items.forEach( card => {
            sortOrder.push({sortName: card.faces[0].name, sortReviewId: card.reviewId, sortCardId: card.cardId});
        });
    })

    const { myIndex, nextUrl, prevUrl, cardGalleryUrl } = navTools(sortOrder, reviewId, userSetId, params);

    if (loading) { return <h1>Loading</h1> }
    if (error) { return <ErrorPage error={error}/>} 

    function toggleCount(removeTag, tagId) {
        let updateCount = [...setTags]; 

        const difference = removeTag ? -1 : 1; 

        updateCount = updateCount.map(tag => {
                if (tag.tagId !== tagId) {
                    return tag; 
                } else {
                    return ({...tag, tagCount: tag.tagCount + difference});
                }
            }
        );

        return updateCount; 
    }

    function toggleTag(tagId) {
        const removeTag = selectedTags.has(tagId);

        if (removeTag) {
            const newSet = new Set(selectedTags);
            newSet.delete(tagId);
            setSelectedTags(newSet); 
        } else {
            setSelectedTags(new Set(selectedTags).add(tagId)); 
        }

        setSetTags(toggleCount(removeTag, tagId));
    }
    
    async function handleSaveClick() {
        if (saving === 'saving') { return; }
        setSaving('saving');
        try {
            const url = `reviews/${reviewId}`;
            const body = {rank: cardDetails.rank, notes: cardDetails.notes, selectedTags: Array.from(selectedTags), 
                                      userSetId: cardDetails.userSetId, trophies: trophies}; 

            await axiosPrivate.put(url, body, { headers: { 'Content-Type': 'application/json'}});
            await queryClient.invalidateQueries(['cards', userSetId]);
            const cacheKey = ['sortOrder', userSetId, filter, partition, sort];
            await queryClient.invalidateQueries(cacheKey);

            setSaving('success');
            setTimeout(() => setSaving('idle'), 1000);
        } catch (err) {
            setSaving('error');
            setTimeout(() => setSaving('idle'), 1000);
            console.log(err); 
        } 
    }

    function viewTaggedCards(tagId) {
        navigate(`/setreviews/${userSetId}/cards?filter=tag:${tagId}`);
    }

    async function handleDeleteTag(tagId) {
        const confirmed = window.confirm("Are you sure you want to delete this tag?");

        if (!confirmed) {
            return;
        }

        try {
            const url = `tags/${tagId}`;
            await axiosPrivate.delete(url);

            setSetTags([...setTags].filter(tag => tag.tagId !== tagId));
            const newSet = new Set(selectedTags);
            newSet.delete(tagId);
            setSelectedTags(newSet);

        } catch (err) {
            setDeleteTagError("Error in deleting tag");
            console.log(err); 
        }
    }
    
    function handleRankChange(rank) { setCardDetails({...cardDetails, rank: rank}); }
    function handleNotesChange(e) { setCardDetails({...cardDetails, notes: e.target.value}); }
  
    const reviewTags = setTags.filter(tag => selectedTags.has(tag.tagId));
    const reviewData = {review_id: cardDetails.reviewId, card_name: cardDetails.faces[0].name, image_normal: cardDetails.faces[0].imageNormal};
    const displayTrophies = trophies.filter(trophy => trophy.review_id === reviewId);
    const noTags = selectedTags.size === 0;

    return (
            <div className={styles.pageWrapper}>
                <div className={styles.backWrap}>
                    <Link to={cardGalleryUrl} className={styles.navButton}> <ArrowBackIosTwoToneIcon/> Card Gallery</Link> 
                    <h6 className={styles.mechs}>FILTER: {filter} | PARTITION: {partition} | SORT: {sort}</h6>
                </div>
                <div className={styles.cardWrapper}>
                    <ReviewCard imageUrl={cardDetails.faces[0].borderCrop} rank={cardDetails.rank}
                                prevUrl={prevUrl} nextUrl={nextUrl} myIndex={myIndex} total={sortOrder.length}
                                showRatings={showRatings}/>

                    <div className={styles.cardInformation}>
                        <div className={styles.header}>
                            <h1>{cardDetails.faces[0].name}</h1>
                            <TrophyDisplay displayTrophies={displayTrophies} modalOnClick={() => setIsModalOpen(true)}></TrophyDisplay>
                            <SaveButton handleSaveClick={handleSaveClick} saving={saving}/>
                            <TrophyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} 
                                         trophies={trophies} setTrophies={setTrophies} reviewData={reviewData}/>
                        </div>
                        <RankWidget rank={cardDetails.rank} handleRankChange={handleRankChange}/> 
                        <HideRatingsButton showRatings={showRatings} setShowRatings={setShowRatings}/>
                        <Notes notesValue={cardDetails.notes} handleNotesChange={handleNotesChange}/>
                        <ReviewTagList reviewTags={reviewTags} handleDelete={handleDeleteTag} selectedTags={selectedTags}
                                       toggleTag={toggleTag} reviewId={reviewId} showPanel={showPanel} viewTaggedCards={viewTaggedCards}/>
                        <div>
                            <TagPanelButton showPanel={showPanel} setShowPanel={setShowPanel} noTags={noTags}/>
                            {showPanel && 
                                <>
                                    <TagPanel selectedTags={selectedTags} setSelectedTags={setSelectedTags}
                                            setTags={setTags} setSetTags={setSetTags} userSetId={cardDetails.userSetId}
                                            toggleTag={toggleTag} handleDeleteTag={handleDeleteTag} viewTaggedCards={viewTaggedCards}/>
                                    {deleteTagError && <p className={styles.deleteTagError}>{deleteTagError}</p>}
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default CardPage; 