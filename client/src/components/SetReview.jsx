import Panel from './Panel';

function SetReview({set_review_name, user_set_img, user_set_id, selectedSetReviewID, handleClick}) {
    return (
        <>
            <button onClick={() => handleClick(user_set_id)} className="setReview" style={{backgroundImage: `url(${user_set_img})`}}>
                0%
            </button>
            <p>{set_review_name}</p>
            {selectedSetReviewID === user_set_id && <Panel></Panel>}
        </>
    );
}

export default SetReview; 