import styles from "./SetReview.module.css";

function SetReview({setReviewData, handleSetReviewClick, isSelected}) {
    
    const notSelectedStyles = isSelected ? `` : `${styles.notSelected}`; 
    const {name, user_set_img, user_set_id} = setReviewData; 

    return (
        <div className={styles.srWrapper}>
            <button onClick={() => handleSetReviewClick(user_set_id)} className={`${styles.setReview} ${notSelectedStyles}`} 
            style={{backgroundImage: `url(${user_set_img})`}}> 
            </button>
            <p className={`${styles.label} ${notSelectedStyles}`}>{name}</p>
        </div>
    );
}

export default SetReview; 