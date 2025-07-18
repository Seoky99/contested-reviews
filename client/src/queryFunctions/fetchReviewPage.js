/**
 * Fetches all the information the "card page" requires for a review
 * Card details (ranks, notes), user tags 
 * TODO: Consider refactoring all under one endpoint 
 * @param {*} userSetId 
 * @param {*} cardId 
 * @returns 
 */
async function fetchReviewPage(reviewId) {

    try { 
        const url = [`http://localhost:8080/api/reviews/${reviewId}`];
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Server failure" + response.status);
        }
        
        return (await response.json());

    } catch (err) {
        throw new Error("Fetching issue" + err);
    } 
}

export default fetchReviewPage; 