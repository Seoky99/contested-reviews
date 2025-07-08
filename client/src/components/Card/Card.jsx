import styles from "./Card.module.css"
import { Link } from "react-router";

function Card({cardData, userSetId}) {
    return (
        <div className={styles.card}>
            <Link className={styles.cardButton} style={{backgroundImage: `url(${cardData.image_urls[0]})`}} 
                  to={`/setreviews/${userSetId}/cards/${cardData.card_id}`}> 
            </Link>
            <h1>{cardData.rank}</h1>
        </div>
    );
}

export default Card; 