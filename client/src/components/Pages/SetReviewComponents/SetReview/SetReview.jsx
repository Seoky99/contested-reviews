import SetWidgets from './SetWidgets';
import styles from "./SetReview.module.css";

function SetReview({setReviewData, deleteSetReview, selectedSetReviewID, handleSetReviewClick}) {
    
    const {name, user_set_img, user_set_id} = setReviewData; 

    return (
        <>
            <button onClick={() => handleSetReviewClick(user_set_id)} className={styles.setReview} 
            style={{backgroundImage: `url(${user_set_img})`}}>
                0%
            </button>
            <p>{name}</p>
            {selectedSetReviewID === user_set_id && <SetWidgets userSetId={user_set_id} deleteSetReview={deleteSetReview}></SetWidgets>}
        </>
    );
}

export default SetReview; 