import styles from "./InfoSquare.module.css"

function InfoSquare({title, caption, icon: IconComp}) {
    return (
        <div className={styles.text}>
            <div className={styles.iconTitle}>
                <h1 className="title">{title}</h1>
                <IconComp/>
            </div>
            <p>{caption}</p>
        </div>
    );
}

export default InfoSquare; 