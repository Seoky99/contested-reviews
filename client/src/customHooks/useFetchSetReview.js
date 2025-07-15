import { useEffect, useState } from "react"

/**
 * Fetches all the information the "set reviews" page requires for a review
 * Tags, trophies, aggregated data 
 * @param {*} userSetId 
 * @returns 
 */
function useFetchSetReview(userSetId) {

    /*const [setTags, setSetTags] = useState([]); 
    const [selectedTags, setSelectedTags] = useState((new Set())); */

    const [trophies, setTrophies] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect( () => {

        /*async function fetchCard() {
            const cardUrl = `http://localhost:8080/api/setreviews/${userSetId}/cards/${cardId}`;
            const response = await fetch(cardUrl);
            if (!response.ok) {
                throw new Error("Card fetch failure" + response.status);
            }
            const cardData = await response.json();
            setCardDetails(cardData);
            return [cardData.reviewId, cardData.userSetId]; 
        }  */

        /*async function fetchAllTags(reviewId) {
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
        } */

        async function fetchAllTrophies(userSetId) {
            const url = [`http://localhost:8080/api/setreviews/${userSetId}/trophies`];
            const trophyResponse = await fetch(url);
      
            if (!trophyResponse.ok) {
                throw new Error("Trophies fetch failure" + trophyResponse.status);
            }
            const trophiesData = await trophyResponse.json();
            setTrophies(trophiesData);
        }

        async function fetchPageDetails() {
            try {
                //const [reviewId, userSetId] = await fetchCard(); 
                await fetchAllTrophies(userSetId);
            } catch (err) {
                console.log(err); 
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        fetchPageDetails(); 

    }, [userSetId]); 

    return { trophies, setTrophies, loading, error };
}

export default useFetchSetReview; 