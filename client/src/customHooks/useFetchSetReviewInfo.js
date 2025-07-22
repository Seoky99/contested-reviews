import { useState, useEffect } from 'react';

function useFetchSetReviewInfo() {

    const [setReviews, setSetReviews] = useState([]);
    const [selectedSetReviewID, setSelectedSetReviewID] = useState();

    const [loading, setLoading] = useState(true);
    const [ error, setError ] = useState(null);

    useEffect( () => {
        async function fetchSetReviewInfo() {
            const url = ['http://localhost:8080/api/setreviews'];

            try {
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error("server error");
                }
                const setReviewData = await response.json();

                setSetReviews(setReviewData);
                setSelectedSetReviewID(setReviewData.length > 0 ? setReviewData[0].user_set_id : -1); 

            } catch (err) {
                console.log(err);
                setError(err);
            } finally {
                setLoading(false);
            }
        } 

        fetchSetReviewInfo(); 

    }, []); 
    return {setReviews, setSetReviews, selectedSetReviewID, setSelectedSetReviewID, loading, error}; 
}

export default useFetchSetReviewInfo;