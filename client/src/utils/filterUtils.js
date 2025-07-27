function filterByMonocolor(review, color) {
    return review.faces[0].colors.length === 1 && review.faces[0].colors[0] === color;
}

function filterByMulticolor(review) {
    return review.faces[0].colors.length > 1;
}

function filterByTagExists(review) {
    return review.tags.length > 0;
}

function filterByMainSet(review) {
    return !(review.isBonus); 
}

function filterByBonus(review) {
    return review.isBonus; 
}

function filterByTag(review, tagValue) {

    const hasId = review.tags.filter(tag => {
        return Number(tag.tagId) === Number(tagValue)
    });
    
    return hasId.length >=1;
}

export default { filterByMonocolor, filterByMulticolor, filterByTagExists, filterByMainSet, filterByBonus, filterByTag };