import styles from "./PodWidgets.module.css";

function PodWidgets() {

    return (
        <>
            <button disabled className={styles.podWidget}>Create Pod!</button>
            <button disabled className={styles.podWidget}>Join Pod!</button>
        </>
    );

}

export default PodWidgets; 