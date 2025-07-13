import { useEffect, useState } from "react"

/**
 * Fetches all the information the "card page" requires for a review
 * Card details (ranks, notes), user tags 
 * @param {*} userSetId 
 * @param {*} cardId 
 * @returns 
 */
function useFetchReview(userSetId, cardId) {

    const [cardDetails, setCardDetails] = useState(null);
    const [setTags, setSetTags] = useState([]); 
    const [selectedTags, setSelectedTags] = useState((new Set()));

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
            return cardData.reviewId; 
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

        async function fetchPageDetails() {

            try {
                const reviewId = await fetchCard(); 

                if (reviewId) {
                    await fetchAllTags(reviewId); 
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

    return { cardDetails, setCardDetails, setTags, setSetTags, selectedTags, setSelectedTags, loading, error };
}

export default useFetchReview; 