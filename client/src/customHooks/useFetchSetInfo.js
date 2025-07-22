import { useState, useEffect } from 'react';

 function useFetchSetInfo() {

    const [sets, setSets] = useState([]);
    const [selectedSetID, setSelectedSetID] = useState('');

    const [loading, setLoading] = useState(true);
    const [ error, setError ] = useState(null);

    useEffect( () => {
        async function fetchPageInformation() {
            const url = ['http://localhost:8080/api/sets'];

            try {
                const response = await fetch(url); 

                if (!response.ok) { 
                    throw new Error("server error");
                }

                const setData = await response.json(); 

                if (setData.length < 1) {
                    throw new Error("No sets available.");
                }

                setSets(setData); 
                setSelectedSetID(setData[0].set_id);
            } catch (err) {
                console.log(err);
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        fetchPageInformation(); 
    }, []);

    return {sets, setSets, selectedSetID, setSelectedSetID, loading, error}; 
}
        
export default useFetchSetInfo;