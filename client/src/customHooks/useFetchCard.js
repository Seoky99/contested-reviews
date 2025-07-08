import { useEffect, useState } from "react"

function useFetchCard(userSetId, cardId) {

    const [cardDetails, setCardDetails] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect( () => {
            
        async function fetchCard() {

            const url = `http://localhost:8080/api/setreviews/${userSetId}/cards/${cardId}`;      
            try {
                const response = await fetch(url);
                const cardData = await response.json();

                //map each textarea: if null, ' '.

                setCardDetails(cardData);
            } catch (err) {
                console.log(err);
                setError(err);
            } finally {
                setLoading(false);
            }
        } 
        fetchCard(); 

    }, [userSetId, cardId]); 

    return { cardDetails, setCardDetails, loading, error };
}

export default useFetchCard; 