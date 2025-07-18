import styles from "./GalleryCard.module.css"
import { Link, useLocation } from "react-router";

function GalleryCard({cardData, userSetId, reviewId}) {

    let location = useLocation(); 
    const params = new URLSearchParams(location.search); 
    const addQuestionMark = params.toString() === '' ? `` : `?`; 

    let url = `/setreviews/${userSetId}/reviews/${reviewId}/cards/${cardData.cardId}` + addQuestionMark + params.toString(); 

    return (
        <div className={styles.card}>
            <Link className={styles.cardButton} style={{backgroundImage: `url(${cardData.faces[0].borderCrop})`}} 
                  to={url}> 
            </Link>
            <h1>{cardData.rank}</h1>
        </div>
    );
}

export default GalleryCard; 