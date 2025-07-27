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
    return review.tags.includes(tagValue);
}

export default { filterByMonocolor, filterByMulticolor, filterByTagExists, filterByMainSet, filterByBonus, filterByTag };