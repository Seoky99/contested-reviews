import { useEffect, useState } from "react"
import axiosPrivate from "./store/useAxiosPrivate";

function useFetchPodViewPage(podId, userSetId) {

    const [cards, setCards] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect( () => {

        async function fetchPageDetails() {

            try { 

                const url = `pods/${podId}/view/${userSetId}/cards`;
                const pageData = (await axiosPrivate.get(url)).data;
      
                setCards(pageData);
            
            } catch (err) {
                setError(err); 
            } finally {
                setLoading(false);
            }
        }

        fetchPageDetails(); 

    }, [podId, userSetId]); 

    return { cards, setCards, loading, error };
}

export default useFetchPodViewPage; 