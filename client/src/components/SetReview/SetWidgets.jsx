import styles from "./SetWidgets.module.css"

function SetWidgets({tempPageNav}) {
    return (
        <div className={styles.widgetWrapper}>
            <button onClick={tempPageNav} className={styles.panelButton}>EDIT</button>
            <button className={styles.panelButton}>DELETE</button>
        </div>
    );
}

export default SetWidgets;