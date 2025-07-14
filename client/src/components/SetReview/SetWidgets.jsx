import styles from "./SetWidgets.module.css"
import { Link } from "react-router";

function SetWidgets({userSetId, deleteSetReview}) {

    return (
        <div className={styles.widgetWrapper}>
            <Link to={`/setreviews/${userSetId}`} className={styles.panelButton}>VIEW</Link>
            <Link to={`/setreviews/${userSetId}/cards`} className={styles.panelButton}>EDIT</Link>
            <button className={styles.panelButton} onClick={deleteSetReview}>DELETE</button>
        </div>
    );
}

export default SetWidgets;