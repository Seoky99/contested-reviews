import { useEffect, useState } from "react"
import axiosPrivate from "./store/useAxiosPrivate";

function useFetchPodInfo() {

    const [pageDetails, setPageDetails] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect( () => {

        async function fetchPageDetails() {

            try { 

                const url = `pods`;
                const pageData = (await axiosPrivate.get(url)).data;
      
                console.log(pageData);

                setPageDetails(pageData);
            
            } catch (err) {
                setError(err); 
            } finally {
                setLoading(false);
            }
        }

        fetchPageDetails(); 

    }, []); 

    return { pageDetails, setPageDetails, loading, error };
}

export default useFetchPodInfo; 