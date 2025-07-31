import styles from "../SetReviewEditCardsPageComponents/EditCard.module.css";

function ViewCard({cardData}) {
    
    return (
        <div className={styles.card}>
            <div className={styles.cardButton} style={{backgroundImage: `url(${cardData.faces[0].borderCrop})`}}> 
            </div>
            <h1>{cardData.rank}</h1>
        </div>
    );
}

export default ViewCard; 