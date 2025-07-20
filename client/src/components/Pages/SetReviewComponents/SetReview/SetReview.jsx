import SetWidgets from './SetWidgets';
import styles from "./SetReview.module.css";

function SetReview({setReviewData, handleSetReviewClick}) {
    
    const {name, user_set_img, user_set_id} = setReviewData; 

    return (
        <div className={styles.srWrapper}>
            <button onClick={() => handleSetReviewClick(user_set_id)} className={styles.setReview} 
            style={{backgroundImage: `url(${user_set_img})`}}> 
            </button>
            <p className={styles.label}>{name}</p>
        </div>
    );
}

export default SetReview; 