import styles from "./ImagePreview.module.css"

function ImagePreview({source}) {


    return (
        <div className={styles.previewWrapper}>
            <img className={styles.image} src={source} height="350" width="780"/>
        </div>
    );

}

export default ImagePreview; 