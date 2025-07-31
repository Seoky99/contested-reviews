import styles from "./SetWidgets.module.css"
import { Link } from "react-router";

function SetWidgets({podIds, userSetId, deleteSetReview, lockInSetReview, unlockSetReview}) {

    const isLocked = podIds.length >= 1; 

    const style = isLocked ? styles.lockedButton : styles.lockInButton; 
    const label = isLocked ? 'Locked In!' : 'Lock Into Pods!' ;
    const handleClick = isLocked ?  unlockSetReview : lockInSetReview;
    const reviewLabel = isLocked ? 'Reviews Locked! (Unlocked in Beta)' : 'Review Cards';

    return (
        <div className={styles.widgetWrapper}>
            <Link to={`/setreviews/${userSetId}`} className={styles.panelButton}>View Stats</Link>
            <Link to={`/setreviews/${userSetId}/cards`} className={styles.panelButton}>{reviewLabel}</Link>
            <button className={style} onClick={handleClick}>{label}</button>
            <button className={styles.deleteButton} onClick={deleteSetReview}>Delete Set Review</button>
        </div>
    );
}

export default SetWidgets;