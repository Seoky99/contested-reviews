import axiosPrivate from "../customHooks/store/useAxiosPrivate";

async function fetchGallery(userSetId) {
    const url = `setreviews/${userSetId}/cards`;      
    try {
        const {data: cards} = await axiosPrivate.get(url);
        return cards; 
        
    } catch (err) {

        console.log(err);

        if (err.response) {
            const status = err.response.status;
            const message = err.response.data?.message || 'Unknown error';
            throw new Error(`(${status}) ${message}`);
        }

        throw new Error("Fetching error " + err);
    } 
} 

export default fetchGallery;