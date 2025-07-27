import styles from "./GalleryPartition.module.css";

function GalleryPartition({userSetId, reviewArray, renderChild}) {
    let { key: name, items } = reviewArray;
    
    const display = items.map(review => {
        return renderChild(review, userSetId);
    });

    //no children will not be displayed - depends on partition value tbh
    if (display.length === 0) return;
    
    return (
            <>
                <div className={styles.label}>
                    <h1>{name}</h1>
                    <p><i>({items.length})</i></p>
                </div>
                <div className={styles.partition}>
                    {display}
                </div> 
            </>
        ); 
}

export default GalleryPartition;