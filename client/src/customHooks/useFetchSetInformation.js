import { useState, useEffect } from 'react';

function useFetchSetInformation() {

    const [sets, setSets] = useState([]);
    const [setReviews, setSetReviews] = useState([]);

    const [selectedSetID, setSelectedSetID] = useState('');
    const [selectedSetReviewID, setSelectedSetReviewID] = useState();

    const [loading, setLoading] = useState(true);
    const [ error, setError ] = useState(null);

    useEffect( () => {
        async function fetchPageInformation() {
            const urls = [
                'http://localhost:8080/api/sets',
                'http://localhost:8080/api/setreviews'
            ];

            try {
                const responses = await Promise.all(urls.map(url => fetch(url)));
                const [setData, setReviewData] = await Promise.all(responses.map(response => response.json()));
                
                setSets(setData); 
                setSetReviews(setReviewData);
                setSelectedSetID(setData[0].set_id);
                setSelectedSetReviewID(setReviewData.length > 0 ? setReviewData[0].user_set_id : -1); 

            } catch (err) {
                console.log(err);
                setError(err);
            } finally {
                setLoading(false);
            }
        } 
        fetchPageInformation(); 
    }, []); 

    return {sets, setReviews, setSetReviews, selectedSetID, setSelectedSetID, selectedSetReviewID, setSelectedSetReviewID, 
        loading, error}; 
}

export default useFetchSetInformation;