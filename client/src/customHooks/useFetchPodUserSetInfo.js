import { useEffect, useState } from "react"
import axiosPrivate from "./store/useAxiosPrivate";

/**
 * Fetches all the information the "card page" requires for a review
 * Card details (ranks, notes), user tags 
 * @param {*} userSetId 
 * @param {*} cardId 
 * @returns 
 */
function useFetchPodUserSetInfo(podId) {

    const [userSets, setUserSets] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect( () => {

        async function fetchPageDetails() {

            try { 

                const url = `pods/${podId}`;
                const pageData = (await axiosPrivate.get(url)).data;

                setUserSets(pageData);
            
            } catch (err) {
                setError(err); 
            } finally {
                setLoading(false);
            }
        }

        fetchPageDetails(); 

    }, [podId]); 

    return { userSets, setUserSets, loading, error };
}

export default useFetchPodUserSetInfo; 