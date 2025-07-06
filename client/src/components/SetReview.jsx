import Panel from './Panel';

function SetReview({setReviewData, selectedSetReviewID, handleSetReviewClick, tempPageNav}) {
    
    const {set_review_name, user_set_img, user_set_id} = setReviewData; 

    return (
        <>
            <button onClick={() => handleSetReviewClick(user_set_id)} className="setReview" style={{backgroundImage: `url(${user_set_img})`}}>
                0%
            </button>
            <p>{set_review_name}</p>
            {selectedSetReviewID === user_set_id && <Panel tempPageNav={() => tempPageNav(user_set_id)}></Panel>}
        </>
    );
}

export default SetReview; 