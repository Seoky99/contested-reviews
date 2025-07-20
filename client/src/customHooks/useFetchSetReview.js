import { useEffect, useState } from "react"

/**
 * Fetches all the information the "set reviews" page requires for a review
 * Tags, trophies, aggregated data 
 * @param {*} userSetId 
 * @returns 
 */
function useFetchSetReview(userSetId) {

    const [trophies, setTrophies] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect( () => {
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