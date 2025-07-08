import { useState, useEffect } from "react"; 

function useFetchGallery(userSetID) {

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect( () => {
        async function fetchReviews() {

            const url = `http://localhost:8080/api/setreviews/${userSetID}/cards`;      
            try {
                const response = await fetch(url);
                const reviewData = await response.json();
                setReviews(reviewData);
            } catch (err) {
                console.log(err);
                setError(err);
            } finally {
                setLoading(false);
            }
        } 
        fetchReviews(); 
    }, [userSetID]); 

    return {reviews, setReviews, loading, error};
}

export default useFetchGallery;