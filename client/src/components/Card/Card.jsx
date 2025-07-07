import styles from "./Card.module.css"

function Card({cardData}) {
    return (
        <div className={styles.card}>
            <button className={styles.cardButton} style={{backgroundImage: `url(${cardData.image_urls[0]})`}}></button>
            <h1>{cardData.rank}</h1>
        </div>
    )
}

export default Card; 