import ImagePreview from "../ImagePreview";
import styles from "./ImageSection.module.css";

function ImageSection() {

    return (
        <div className={styles.aboutContentWrapper}>
            <div className={styles.content}>
                <ImagePreview source="./home/contested1crop.png" isLeft={true} titleCap="Maintain a collection" 
                caption="Spoiler season is the best kind of season! Immortalize your card evaluation skills by 
                keeping track of your favorite cards!"/>
                <ImagePreview source="./home/contested2crop.png" isLeft={true} titleCap="Take detailed notes" 
                caption="Our system makes it easy to rate cards! Utilize our keyboard shortcuts to make 
                rating a set a breeze!"/>
            </div>
        </div>
    );

}

export default ImageSection; 