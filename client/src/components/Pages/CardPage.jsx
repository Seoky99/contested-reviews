import { useParams } from "react-router";
import styles from "./CardPage.module.css";
import useFetchReview from "../../customHooks/useFetchReview";

import ReviewTagList from "./CardPageComponents/Tag/ReviewTagList";
import TagPanel from "./CardPageComponents/Tag/TagPanel";
import TrophyModal from "./CardPageComponents/TrophyModal/TrophyModal";
import Notes from "./CardPageComponents/Notes/Notes";
import RankWidget from "./CardPageComponents/RankWidget/RankWidget";
import { useState } from "react";

function CardPage() {
    const { userSetId, cardId } = useParams(); 
    const { cardDetails, setCardDetails, setTags, setSetTags, selectedTags, setSelectedTags, trophies, setTrophies,
            loading, error } = useFetchReview(userSetId, cardId);
    const [ showPanel, setShowPanel ] = useState(false);
    const [ saving, setSaving ] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
                body: JSON.stringify({rank: cardDetails.rank, notes: cardDetails.notes, selectedTags: Array.from(selectedTags)}),
            });
            const success = await response.json(); 
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

    const reviewTags = setTags.filter(tag => selectedTags.has(tag.tagId));
    const reviewId = cardDetails.reviewId;

    console.log(cardDetails);

    return (
            <div className={styles.cardWrapper}>
                <div className={styles.cardRank}>
                    <h1>{cardDetails.rank === null ? "NR" : cardDetails.rank}</h1>
                    <img className={styles.cardImage} src={cardDetails.faces[0].imageNormal}></img>
                </div>

                <div className={styles.cardInformation}>
                    <div className={styles.header}>
                        <h1>{cardDetails.faces[0].name}</h1>
                        <button onClick={openModal} className={styles.addTrophyButton}>Add Trophy</button>
                        <TrophyModal isOpen={isModalOpen} onClose={closeModal} trophies={trophies}/>
                    </div>

                    <RankWidget rank={cardDetails.rank} handleRankChange={handleRankChange}/>
                    <Notes notesValue={cardDetails.notes} handleNotesChange={handleNotesChange}/>
                    <ReviewTagList reviewTags={reviewTags} handleDelete={handleDelete} selectedTags={selectedTags}
                                   toggleTag={toggleTag} reviewId={reviewId} showPanel={showPanel}/>
                   
                    <button className={styles.addTagButton} onClick={() => setShowPanel(!showPanel)}>Manage Tags {showPanel ? `▲` : `▼`}</button>

                    {showPanel && <TagPanel selectedTags={selectedTags} setSelectedTags={setSelectedTags}
                                            setTags={setTags} setSetTags={setSetTags} setId={cardDetails.setId}
                                            toggleTag={toggleTag}/>}
                    
                    {saving && <h4>Saving!</h4>}
                    <button type="submit" onClick={handleSaveClick} className={styles.saveButton}>Save</button>
                </div>
            </div>
    )
}

export default CardPage; 