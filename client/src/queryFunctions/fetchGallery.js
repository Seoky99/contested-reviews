import { cardClasses } from "@mui/material/Card";

async function fetchGallery(userSetId) {
    const url = `http://localhost:8080/api/setreviews/${userSetId}/cards`;      
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Server error" + response.status);
        }

        const cards = await response.json();
        console.log(cards); 
        return cards; 
        
    } catch (err) {
        throw new Error("Fetching error " + err);
    } 
} 

export default fetchGallery;