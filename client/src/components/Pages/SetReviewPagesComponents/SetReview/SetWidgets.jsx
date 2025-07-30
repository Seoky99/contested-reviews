import styles from "./SetWidgets.module.css"
import { Link } from "react-router";

function SetWidgets({podIds, userSetId, deleteSetReview, lockInSetReview}) {

    const isLocked = podIds.length < 1; 

    const style = isLocked ? styles.lockInButton : styles.lockedButton; 
    const label = isLocked ? 'Lock Into Pods!' : 'Locked In!';
    const handleClick = isLocked ? lockInSetReview : () => {};

    return (
        <div className={styles.widgetWrapper}>
            <Link to={`/setreviews/${userSetId}`} className={styles.panelButton}>View Stats</Link>
            <Link to={`/setreviews/${userSetId}/cards`} className={styles.panelButton}>Review Cards</Link>
            <button className={style} onClick={handleClick}>{label}</button>
            <button className={styles.deleteButton} onClick={deleteSetReview}>Delete Set Review</button>
        </div>
    );
}

export default SetWidgets;