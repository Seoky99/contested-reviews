import { useEffect, useState } from "react"
import axiosPrivate from "./store/useAxiosPrivate";

/**
 * Fetches all the information the "card page" requires for a review
 * Card details (ranks, notes), user tags 
 * TODO: Consider refactoring all under one endpoint 
 * @param {*} userSetId 
 * @param {*} cardId 
 * @returns 
 */
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

                const url = `reviews/${reviewId}`;
                const {cardDetails, reviewTags, setTags, trophies} = (await axiosPrivate.get(url)).data;
      
                console.log(cardDetails); 
                                console.log(reviewTags);
                                                console.log(setTags);
                                                                console.log(trophies); 
 
 


                if (cardDetails.notes === null) {
                    cardDetails.notes = '';
                }

                setCardDetails(cardDetails);
                setSetTags(setTags);
                setSelectedTags(new Set(reviewTags.map(tag => tag.tagId)));
                setTrophies(trophies);
            
            } catch (err) {
                setError(err); 
            } finally {
                setLoading(false);
            }
        }

        fetchPageDetails(); 

    }, [reviewId]); 

    return { cardDetails, setCardDetails, setTags, setSetTags, selectedTags, setSelectedTags, trophies, setTrophies, loading, error };
}

export default useFetchReview; 