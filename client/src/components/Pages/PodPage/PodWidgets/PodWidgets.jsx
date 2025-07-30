import styles from "./PodWidgets.module.css";

function PodWidgets() {

    return (
        <div className={styles.buttonWrapper}>
            <button disabled className={styles.podWidget}>Create Pod!</button>
            <button disabled className={styles.podWidget}>Join Pod!</button>
        </div>
    );

}

export default PodWidgets; 