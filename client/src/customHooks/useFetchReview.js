import { useEffect, useState } from "react"

/**
 * Fetches all the information the "card page" requires for a review
 * Card details (ranks, notes), user tags 
 * TODO: Consider refactoring all under one endpoint 
 * @param {*} userSetId 
 * @param {*} cardId 
 * @returns 
 */
//function useFetchReview(userSetId, cardId) {
function useFetchReview(reviewId) {

    const [cardDetails, setCardDetails] = useState(null);
    const [setTags, setSetTags] = useState([]); 
    const [selectedTags, setSelectedTags] = useState((new Set()));

    const [trophies, setTrophies] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect( () => {

        async function fetchPageDetails() {

            try { 

            const url = [`http://localhost:8080/api/reviews/${reviewId}`];
            const response = await fetch(url);
      
            if (!response.ok) {
                throw new Error("Trophies fetch failure" + response.status);
            }
            const {cardDetails, reviewTags, setTags, trophies} = await response.json();

            if (cardDetails.notes === null) {
                cardDetails.notes = '';
            }

            setCardDetails(cardDetails);
            setSetTags(setTags);
            setSelectedTags(new Set(reviewTags.map(tag => tag.tagId)));
            setTrophies(trophies);
            } catch (err) {
                setError(err); 
                console.log(err);
            } finally {
                setLoading(false);
            }
        }

        fetchPageDetails(); 

    }, [reviewId]); 

    return { cardDetails, setCardDetails, setTags, setSetTags, selectedTags, setSelectedTags, trophies, setTrophies, loading, error };
}

export default useFetchReview; 