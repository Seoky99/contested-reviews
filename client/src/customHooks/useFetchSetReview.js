import { useEffect, useState } from "react"
import axiosPrivate from "./store/useAxiosPrivate";

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
            const url = `setreviews/${userSetId}/trophies`;
            const trophiesData = (await axiosPrivate.get(url)).data;
            const trophyPresentsInit = Array(trophiesData.length).fill(false); 

            setTrophies(trophiesData);
            setOpenTrophyPresents(trophyPresentsInit);
        }

        async function fetchStats() {
        const url = `/setreviews/${userSetId}/stats/colors`;
            const stats = (await axiosPrivate.get(url)).data;

            setStats(stats);
        }

        async function fetchSetReviewInfo() {
            console.log("?");
            const url = `setreviews/${userSetId}`;
            const setReviewData = (await axiosPrivate.get(url)).data;
            
            setSetReviewData(setReviewData);
        } 

        async function fetchPageDetails() {
            try {
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