import { useParams } from "react-router";
import useFetchCard from "../../customHooks/useFetchCard";
import styles from "./CardPage.module.css";

function CardPage() {
    const { userSetId, cardId } = useParams(); 
    const { cardDetails, setCardDetails, loading, error } = useFetchCard(userSetId, cardId); 

    if (loading) { return <h1>Hiya 2</h1> }
    if (error) { return <h1>Hiya</h1>} 

    async function handleClick() {
        try {

            const url = `http://localhost:8080/api/setreviews/${userSetId}/cards/${cardId}`;
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                }, 
                body: JSON.stringify(cardDetails),
            });
            const success = response.json(); 
            console.log(success);

        } catch (err) {
            console.log(err); 
        }
    }

    function handleChange(e) {
        const copyDetails = {...cardDetails, rank: e.target.value}; 
        setCardDetails(copyDetails); 
    }

    function handleNotes(e) {
        const copyDetails = {...cardDetails, notes: e.target.value}; 
        setCardDetails(copyDetails); 
    }

    return (
        <>
            
            <div className={styles.cardWrapper}>
                <div className={styles.cardRank}>
                    <h1>{cardDetails.rank === null ? "NR" : cardDetails.rank}</h1>
                    <img className={styles.cardImage} src={cardDetails.image_urls[0]}></img>
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

                    <div>
                        <label htmlFor="notes">Notes:</label>
                        <textarea id="notes" name="notes" rows="4" cols="50" value={cardDetails.notes} onChange={handleNotes}>

                        </textarea>
                    </div>
                    <p>Tags: TODO</p>
                    <button type="submit" onClick={handleClick} className={styles.saveButton}>Save</button>
                </div>
            </div>
        </>
    )
}

export default CardPage; 