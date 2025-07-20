async function fetchGallery(userSetId) {
    const url = `http://localhost:8080/api/setreviews/${userSetId}/cards`;      
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Server error" + response.status);
        }

        return await response.json();          
        
    } catch (err) {
        throw new Error("Fetching error " + err);
    } 
} 

export default fetchGallery;