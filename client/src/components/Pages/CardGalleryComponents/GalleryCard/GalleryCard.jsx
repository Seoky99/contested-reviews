import styles from "./GalleryCard.module.css"
import { Link } from "react-router";

function GalleryCard({cardData, userSetId}) {
    return (
        <div className={styles.card}>
            <Link className={styles.cardButton} style={{backgroundImage: `url(${cardData.faces[0].imageNormal})`}} 
                  to={`/setreviews/${userSetId}/cards/${cardData.cardId}`}> 
            </Link>
            <h1>{cardData.rank}</h1>
        </div>
    );
}

export default GalleryCard; 