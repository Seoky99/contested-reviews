import styles from "./PodWidgets.module.css";
import { Link } from "react-router"; 

function PodWidgets() {

    return (
        <div className={styles.buttonWrapper}>
            <Link className={styles.podWidget} to="/pods/create">Create Pod!</Link>
            <button disabled className={styles.podWidget}>Join Pod!</button>
        </div>
    );

}

export default PodWidgets; 