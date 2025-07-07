import SetWidgets from './SetWidgets';
import styles from "./SetReview.module.css";

function SetReview({setReviewData, selectedSetReviewID, handleSetReviewClick, tempPageNav}) {
    
    const {set_review_name, user_set_img, user_set_id} = setReviewData; 

    return (
        <>
            <button onClick={() => handleSetReviewClick(user_set_id)} className={styles.setReview} 
            style={{backgroundImage: `url(${user_set_img})`}}>
                0%
            </button>
            <p>{set_review_name}</p>
            {selectedSetReviewID === user_set_id && <SetWidgets tempPageNav={() => tempPageNav(user_set_id)}></SetWidgets>}
        </>
    );
}

export default SetReview; 