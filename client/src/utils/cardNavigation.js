export default function(sortOrder, reviewId, userSetId, params) {
    const myIndex = sortOrder.findIndex(review => review.sortReviewId === reviewId);
    
    const addQuestionMark = params.toString() === '' ? `` : `?`; 
    const sortLength = sortOrder.length; 

    const nextReviewId = myIndex >= sortLength - 1 ? sortOrder[0].sortReviewId :  sortOrder[myIndex + 1].sortReviewId; 
    const nextCardId = myIndex >= sortLength - 1 ? sortOrder[0].sortCardId : sortOrder[myIndex+1].sortCardId; 

    const prevReviewId = myIndex <= 0 ? sortOrder[sortLength-1].sortReviewId : sortOrder[myIndex - 1].sortReviewId; 
    const prevCardId = myIndex <= 0 ? sortOrder[sortLength-1].sortCardId : sortOrder[myIndex-1].sortCardId; 

    const nextUrl = `/setreviews/${userSetId}/reviews/${nextReviewId}/cards/${nextCardId}` + addQuestionMark + params.toString();
    const prevUrl = `/setreviews/${userSetId}/reviews/${prevReviewId}/cards/${prevCardId}` + addQuestionMark + params.toString();;

    const cardGalleryUrl = `/setreviews/${userSetId}/cards` + addQuestionMark + params.toString();


    return {myIndex, nextUrl, prevUrl, cardGalleryUrl}; 
}