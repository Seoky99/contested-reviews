import axiosPrivate from "../customHooks/store/useAxiosPrivate";

async function fetchGallery(userSetId) {
    const url = `setreviews/${userSetId}/cards`;    
    
    try {
        const {data: cards} = await axiosPrivate.get(url);
        return cards; 
        
    } catch (err) {

        console.log(err);
        throw err; 
        
    } 
} 

export default fetchGallery;