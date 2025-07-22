import { useEffect, useState } from "react"

/**
 * Fetches all the information the "set reviews" page requires for a review
 * Tags, trophies, aggregated data 
 * @param {*} userSetId 
 * @returns 
 */
function useFetchSetReview(userSetId) {

    const [setReviewData, setSetReviewData ] = useState(null);

    const [trophies, setTrophies] = useState([]);
    const [openTrophyPresents, setOpenTrophyPresents] = useState([]);
    const [stats, setStats] = useState({});

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect( () => {
        async function fetchAllTrophies() {
            const url = [`http://localhost:8080/api/setreviews/${userSetId}/trophies`];
            const trophyResponse = await fetch(url);
      
            if (!trophyResponse.ok) {
                throw new Error("Trophies fetch failure" + trophyResponse.status);
            }
            const trophiesData = await trophyResponse.json();

            const trophyPresentsInit = Array(trophiesData.length).fill(false); 

            setTrophies(trophiesData);
            setOpenTrophyPresents(trophyPresentsInit);
        }

        async function fetchStats() {
       const url = [`http://localhost:8080/api/setreviews/${userSetId}/stats/colors`];
            const statsResponse = await fetch(url);
      
            if (!statsResponse.ok) {
                throw new Error("Trophies fetch failure" + statsResponse.status);
            }
            const stats = await statsResponse.json();

            setStats(stats);
        }

        async function fetchSetReviewInfo() {
            const url = `http://localhost:8080/api/setreviews/${userSetId}`;

            try {
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error("server error");
                }
                const setReviewData = await response.json();
                console.log(setReviewData);
                setSetReviewData(setReviewData);

            } catch (err) {
                console.log(err);
                setError(err);
            } finally {
                setLoading(false);
            }
        } 

        async function fetchPageDetails() {
            try {
                //const [reviewId, userSetId] = await fetchCard(); 
                await fetchAllTrophies();                
                await fetchStats();  
                await fetchSetReviewInfo(); 
            } catch (err) {
                console.log(err); 
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        fetchPageDetails(); 

    }, [userSetId]); 

    return { setReviewData, trophies, setTrophies, openTrophyPresents, setOpenTrophyPresents, stats, loading, error };
}

export default useFetchSetReview; 