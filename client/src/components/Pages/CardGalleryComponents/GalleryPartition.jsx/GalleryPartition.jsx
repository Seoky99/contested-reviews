import GalleryCard from "../GalleryCard/GalleryCard";
import styles from "./GalleryPartition.module.css";

function GalleryPartition({children, userSetId, name}) {

    const display = children.map(review => {
        return <GalleryCard key={review.reviewId} cardData={review} userSetId={userSetId}></GalleryCard>;
    })

    //make deicsion including with no chidlren
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