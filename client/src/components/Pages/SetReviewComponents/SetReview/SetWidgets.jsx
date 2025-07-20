import styles from "./SetWidgets.module.css"
import { Link } from "react-router";

function SetWidgets({userSetId, deleteSetReview}) {

    return (
        <div className={styles.widgetWrapper}>
            <Link to={`/setreviews/${userSetId}`} className={styles.panelButton}>View Stats</Link>
            <Link to={`/setreviews/${userSetId}/cards`} className={styles.panelButton}>Review Cards</Link>
            <button className={styles.panelButton} onClick={deleteSetReview}>Delete</button>
        </div>
    );
}

export default SetWidgets;