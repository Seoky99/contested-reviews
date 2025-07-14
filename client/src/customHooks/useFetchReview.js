import { useEffect, useState } from "react"

/**
 * Fetches all the information the "card page" requires for a review
 * Card details (ranks, notes), user tags 
 * TODO: Consider refactoring all under one endpoint 
 * @param {*} userSetId 
 * @param {*} cardId 
 * @returns 
 */
function useFetchReview(userSetId, cardId) {

    const [cardDetails, setCardDetails] = useState(null);
    const [setTags, setSetTags] = useState([]); 
    const [selectedTags, setSelectedTags] = useState((new Set()));

    const [trophies, setTrophies] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect( () => {

        async function fetchCard() {
            const cardUrl = `http://localhost:8080/api/setreviews/${userSetId}/cards/${cardId}`;
            const response = await fetch(cardUrl);
            if (!response.ok) {
                throw new Error("Card fetch failure" + response.status);
            }
            const cardData = await response.json();
            setCardDetails(cardData);
            return [cardData.reviewId, cardData.userSetId]; 
        } 

        async function fetchAllTags(reviewId) {
            const urls = [`http://localhost:8080/api/reviews/${reviewId}/tags`,
                          `http://localhost:8080/api/tags` ];
            
            const tagsResponses = await Promise.all(urls.map(url => fetch(url)));
            tagsResponses.forEach(response => {
                if (!response.ok) {
                    throw new Error("tagging failure" + response.status);
                }
            })
            const [reviewTagsData, setTagsData] = await Promise.all(tagsResponses.map(response => response.json()));
            setSetTags(setTagsData);
            setSelectedTags(new Set(reviewTagsData.map(tag => tag.tagId)));
        }

        async function fetchAllTrophies(userSetId, reviewId) {
            const urls = [`http://localhost:8080/api/setreviews/${userSetId}/trophies`,
                          `http://localhost:8080/api/reviews/${reviewId}/trophies`
                         ];
            const trophyResponses = await Promise.all(urls.map(url => fetch(url)));
            trophyResponses.forEach(response => {
                if (!response.ok) {
                    throw new Error("Trophies fetch failure" + response.status);
                }
            })
            const [trophiesData, selectedTrophiesData] = await Promise.all(trophyResponses.map(response => response.json()));
            setTrophies(trophiesData);
        }

        async function fetchPageDetails() {
            try {
                const [reviewId, userSetId] = await fetchCard(); 

                if (reviewId && userSetId) {
                    await fetchAllTags(reviewId); 
                    await fetchAllTrophies(userSetId, reviewId);
                } else {
                    throw new Error("Error in fetching ids");
                }
            } catch (err) {
                console.log(err); 
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        fetchPageDetails(); 

    }, [userSetId, cardId]); 

    return { cardDetails, setCardDetails, setTags, setSetTags, selectedTags, setSelectedTags, trophies, setTrophies, loading, error };
}

export default useFetchReview; 