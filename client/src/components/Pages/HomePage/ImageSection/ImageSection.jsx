import ImagePreview from "../ImagePreview";
import styles from "./ImageSection.module.css";

function ImageSection() {

    return (
        <div className={styles.aboutContentWrapper}>
            {/*<h2 className={styles.aboutCaption}>Rate cards with ease!</h2>*/}
            <ImagePreview source="./home/contested1crop.png" isLeft={false} titleCap="Maintain a collection"/>
            <ImagePreview source="./home/contested2crop.png" isLeft={true} titleCap="Take detailed notes"/>
        </div>
    );

}

export default ImageSection; 