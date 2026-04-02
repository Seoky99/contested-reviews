import styles from "./ImagePreview.module.css"

function ImagePreview({source, isLeft, titleCap, caption}) {

    let title = <div className={styles.titleWrapper}>
                    <h1 className={styles.title}>{titleCap}</h1>
                    <p className={styles.caption}>{caption}</p>
                </div>;
    return (
        <div className={styles.previewWrapper}>
            {isLeft && title}
            <div>
                <img className={styles.image} src={source} height="350" width="780"/>
            </div>
            {!isLeft && title}
        </div>
    );

}

export default ImagePreview; 