import styles from "./InfoSquare.module.css"

function InfoSquare({title, caption, icon: IconComp}) {
    return (
        <div className={styles.text}>
            <div className={styles.iconTitle}>
                <h1 className="title">{title}</h1>
            </div>
            <p className={styles.caption}>{caption}</p>
            <div className={styles.iconBorder}>
                <IconComp/>
            </div>
        </div>
    );
}

export default InfoSquare; 