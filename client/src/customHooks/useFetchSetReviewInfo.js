import { useState, useEffect } from 'react';
import axiosPrivate from './store/useAxiosPrivate';

function useFetchSetReviewInfo() {

    const [setReviews, setSetReviews] = useState([]);
    const [selectedSetReviewID, setSelectedSetReviewID] = useState();

    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState(null);

    useEffect( () => {
        async function fetchSetReviewInfo() {

            const url = '/setreviews';
    
            try {
                const { data: setReviewData } = await axiosPrivate.get(url);

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