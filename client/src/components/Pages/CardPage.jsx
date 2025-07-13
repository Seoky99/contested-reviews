import { useParams } from "react-router";
import useFetchReview from "../../customHooks/useFetchReview";
import styles from "./CardPage.module.css";
import Tag from "../Tag/Tag";
import TagPanel from "../Tag/TagPanel";
import { useState } from "react";

function CardPage() {
    const { userSetId, cardId } = useParams(); 
    const { cardDetails, setCardDetails, setTags, setSetTags, selectedTags, setSelectedTags,
            loading, error } = useFetchReview(userSetId, cardId);
    const [ showPanel, setShowPanel ] = useState(false);
    const [ saving, setSaving ] = useState(false);

    if (loading) { return <h1>Loading</h1> }
    if (error) { return <h1>Error</h1>} 

    const reviewTags = setTags.filter(tag => selectedTags.has(tag.tagId));
    const reviewId = cardDetails.reviewId;

    function toggleTag(tagId) {
        if (selectedTags.has(tagId)) {
            const newSet = new Set(selectedTags);
            newSet.delete(tagId);
            setSelectedTags(newSet); 
        } else {
            setSelectedTags(new Set(selectedTags).add(tagId)); 
        }
    }

    async function handleClick() {
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

    function handleChange(e) { setCardDetails({...cardDetails, rank: e.target.value}); }
    function handleNotes(e) { setCardDetails({...cardDetails, notes: e.target.value}); }

    const tagsDisplay = reviewTags.length === 0 ? <h4>~No tags</h4> : 
    
    reviewTags.map(tag => {
        return <Tag key={tag.tagId} tagName={tag.tagName}
        tagId={tag.tagId} handleDelete={() => handleDelete(reviewId, tag.tagId)} isSelected={selectedTags.has(tag.tagId)}
        isManageMode={showPanel} toggleTag={() => toggleTag(tag.tagId)} viewTaggedCards={() => console.log("Implement me!")}></Tag>
    })

    return (
        <>
            <div className={styles.cardWrapper}>
                <div className={styles.cardRank}>
                    <h1>{cardDetails.rank === null ? "NR" : cardDetails.rank}</h1>
                    <img className={styles.cardImage} src={cardDetails.faces[0].imageNormal}></img>
                </div>

                <div className={styles.cardInformation}>
                    <h1>{cardDetails.name}</h1>

                    <select name="rank" value={cardDetails.rank === null ? "NR" : `${cardDetails.rank}`} onChange={handleChange}>
                        <option value="NR">NR</option>
                        <option value="D">D</option>
                        <option value="C">C</option>
                        <option value="B">B</option>
                        <option value="A">A</option>
                    </select>
                    
                    <div className={styles.notes}>
                        <label htmlFor="notes">Notes:</label>
                        <textarea id="notes" name="notes" rows="4" cols="50" value={cardDetails.notes} onChange={handleNotes}>

                        </textarea>
                    </div>
                    <div>
                        Tags: {tagsDisplay}
                    </div>
                 
                    <button className={styles.addTagButton} onClick={() => setShowPanel(!showPanel)}>Manage Tags{showPanel ? `▲` : `▼`}</button>

                    {showPanel && <TagPanel selectedTags={selectedTags} setSelectedTags={setSelectedTags}
                                            setTags={setTags} setSetTags={setSetTags} setId={cardDetails.setId}
                                            toggleTag={toggleTag}></TagPanel>}
                    
                    {saving && <h4>Saving!</h4>}
                    <button type="submit" onClick={handleClick} className={styles.saveButton}>Save</button>
                </div>
            </div>
        </>
    )
}

export default CardPage; 