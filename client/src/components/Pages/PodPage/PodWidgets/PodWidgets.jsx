import styles from "./PodWidgets.module.css";
import { Link } from "react-router"; 

function PodWidgets() {

    return (
        <div className={styles.buttonWrapper}>
            <Link className={styles.podWidget} to="/pods/create">Create Pod!</Link>
            <Link className={styles.podWidget} to="/pods/join">Join Pod!</Link>
        </div>
    );

}

export default PodWidgets; 