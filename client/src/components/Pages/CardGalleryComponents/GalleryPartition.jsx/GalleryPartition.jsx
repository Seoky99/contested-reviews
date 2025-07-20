import styles from "./GalleryPartition.module.css";

function GalleryPartition({userSetId, reviewArray, renderChild}) {
    const { key: name, items } = reviewArray;
    
    const display = items.map(review => {
        return renderChild(review, userSetId);
    });

    //no children will not be displayed - depends on partition value tbh
    if (display.length === 0) return;
    
    return (
            <>
                <h1 className={styles.label}>{name}</h1>
                <div className={styles.partition}>
                    {display}
                </div> 
            </>
        ); 
}

export default GalleryPartition;