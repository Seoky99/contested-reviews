import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router";
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
import Spinner from "../../Spinner/Spinner.jsx";

function CardPage() {
    let { userSetId, reviewId } = useParams(); 

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
    const [isDirty, setIsDirty] = useState(false);
    
    //Save States: 'idle', 'saving', 'success', 'error' 
    const [ saving, setSaving ] = useState('idle');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const pageRef = useRef(null);

    const handleRankChange = useCallback((val) => { 
        let rank; 

        if (val === '_') {
            rank = '-';
        } else if (val === '=') {
            rank = '+';
        } else {
            rank = val;
        }

        setCardDetails(prev => {
            const prevRank = prev.rank; 
            const validRanks = ['A', 'B', 'C', 'D', 'F'];
            const modifiers = ['+', '-'];

            if (modifiers.includes(rank) && validRanks.includes(prevRank.charAt(0))) {
                if (prevRank.length >= 1 && prevRank.charAt(1) === rank) {
                    rank = '';
                }
                return ({...prev, rank: prevRank.charAt(0) + rank}); 
            } else if (validRanks.includes(rank)) {
                return ({...prev, rank}); 
            } else {
                return prev;
            }
        });

        setIsDirty(true);

    }, [setCardDetails]); 

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

    async function handleNavDirection(direction) {
        if (isDirty) {
            await handleSaveClick();
        }

        if (saving !== 'error') {
            if (direction === 'LEFT') {
                navigate(prevUrl);
            } else if (direction === 'RIGHT') {
                navigate(nextUrl);
            }
        }
    }

    async function handleGalleryNav(e) {
        e.preventDefault(); 

        if (isDirty) {
            await handleSaveClick(); 
        }

        if (saving !== 'error') {
            navigate(cardGalleryUrl, { state : {scrollCardId: cardDetails.cardId }});
        }
    }

    function handleKeyPress(e) {
        const editableContent = e.target.tagName; 
        if (editableContent === 'INPUT' || editableContent === 'TEXTAREA') {
            return; 
        }

        if (e.repeat) {
            e.preventDefault();
            return;
        }

        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
            handleNavDirection(e.key === "ArrowRight" ? "RIGHT" : "LEFT");
        } else {
            handleRankChange(e.key.toUpperCase());   
        }
    }

    useEffect(() => {
        if (!isLoading && !galleryError && !loading && !error) {
            requestAnimationFrame(() => pageRef.current?.focus());
        }
    }, [isLoading, galleryError, loading, error]);

    if (isLoading) { return <Spinner spinnerSize={100}/>}
    if (galleryError) { return <ErrorPage error={galleryError}/>}

    const sortOrder = [];
    sorted.forEach(partition => {
        partition.items.forEach( card => {
            sortOrder.push({sortName: card.faces[0].name, sortReviewId: card.reviewId, sortCardId: card.cardId});
        });
    })

    const { myIndex, nextUrl, prevUrl, cardGalleryUrl } = navTools(sortOrder, reviewId, userSetId, params);

    if (loading) { return <Spinner spinnerSize={100}/> }
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
        setIsDirty(true);
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

            console.log("saving!");

            setSaving('success');
            setTimeout(() => setSaving('idle'), 1000);
        } catch (err) {
            setSaving('error');
            setTimeout(() => setSaving('idle'), 1000);
            console.log(err); 
        } 
        setIsDirty(false);
    }

    function viewTaggedCards(tagId) {
        navigate(`/setreviews/${userSetId}/cards?filter=tag:${tagId}`);
    }

    async function handleDeleteTag(tagId) {
        const confirmed = window.confirm("Are you sure you want to delete this tag?");
        if (!confirmed) { return; }

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

    function handleNotesChange(e) { 
        setCardDetails({...cardDetails, notes: e.target.value}); setIsDirty(true) 
    }
  
    const reviewTags = setTags.filter(tag => selectedTags.has(tag.tagId));
    const reviewData = {review_id: cardDetails.reviewId, card_name: cardDetails.faces[0].name, image_normal: cardDetails.faces[0].imageNormal};
    const displayTrophies = trophies.filter(trophy => trophy.review_id === reviewId);

    return (
            <div className={styles.pageWrapper} onKeyDown={handleKeyPress} tabIndex={0} ref={pageRef}>
                <div className={styles.backWrap}>
                    <Link onClick={handleGalleryNav} className={styles.galleryNavButton}> <ArrowBackIosTwoToneIcon/> Card Gallery</Link> 
                    <h6 className={styles.mechs}>FILTER: {filter} | PARTITION: {partition} | SORT: {sort}</h6>
                </div>
                <div className={styles.cardWrapper}>
                    <ReviewCard imageUrl={cardDetails.faces[0].borderCrop} rank={cardDetails.rank}
                                handleNavDirection={handleNavDirection} myIndex={myIndex} total={sortOrder.length}
                                showRatings={showRatings}/>

                    <div className={styles.cardInformation}>
                        <div className={styles.header}>
                            <h1>{cardDetails.faces[0].name}</h1>
                            <TrophyDisplay displayTrophies={displayTrophies} modalOnClick={() => setIsModalOpen(true)}></TrophyDisplay>
                            {/*<SaveButton handleSaveClick={handleSaveClick} saving={saving}/> */}
                            <TrophyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} setIsDirty={setIsDirty}
                                         trophies={trophies} setTrophies={setTrophies} reviewData={reviewData}/>
                        </div>
                        <RankWidget rank={cardDetails.rank} handleRankChange={handleRankChange}/> 
                        <HideRatingsButton showRatings={showRatings} setShowRatings={setShowRatings}/>
                        <Notes notesValue={cardDetails.notes} handleNotesChange={handleNotesChange}/>
                        <ReviewTagList reviewTags={reviewTags} handleDelete={handleDeleteTag} selectedTags={selectedTags}
                                       toggleTag={toggleTag} reviewId={reviewId} showPanel={showPanel} viewTaggedCards={viewTaggedCards}/>
                        <div>
                            <TagPanelButton showPanel={showPanel} setShowPanel={setShowPanel} noTags={selectedTags.size === 0}/>
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