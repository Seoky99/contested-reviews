import { useEffect, useState } from "react"

function useFetchTags() {

    const [allTags, setAllTags] = useState(); 

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect( () => {
            
        async function fetchTags() {

            const url = `http://localhost:8080/api/tags`;

            try {

                const response = await fetch(url);
   
                const allTagData = await response.json();
                setAllTags(allTagData);

                console.log(allTagData);

            } catch (err) {
                console.log(err);
                setError(err);
            } finally {
                setLoading(false);
            }
        } 
        fetchTags(); 

    }, []); 

    return { allTags, setAllTags, loading, error };
}

export default useFetchTags; 