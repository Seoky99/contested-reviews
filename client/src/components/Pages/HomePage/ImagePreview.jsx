import styles from "./ImagePreview.module.css"
import { Link } from "react-router"

function ImagePreview({source, isLeft, titleCap, caption}) {

    let title = <div className={styles.titleWrapper}>
                    <Link className={`${styles.link} ${styles.homeButton}`} to="/setreviews">Get Started</Link>
                </div>;
    return (
        <div className={styles.previewWrapper}>
            <div className={styles.imageWrapper}>
                <img className={styles.image} src={source}/>
                {isLeft && title}
            </div>
            <div className={styles.text}>
                <div className={styles.innerText}>
                    <h1>{titleCap}</h1>
                    <p>{caption}</p>
                </div>
            </div>
        </div>
    );

}

export default ImagePreview; 