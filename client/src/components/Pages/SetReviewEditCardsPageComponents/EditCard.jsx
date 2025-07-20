import styles from "./EditCard.module.css"

function GalleryCard({cardData, selected, toggleSelection}) {
    let notSelectedStyle; 

    if (!(selected.has(cardData.cardId))) {
        notSelectedStyle = `${styles.notSelected}`;
    }
    
    return (
        <div className={styles.card}>
            <div className={`${styles.cardButton} ${notSelectedStyle}`} style={{backgroundImage: `url(${cardData.faces[0].borderCrop})`}}
                 onClick={toggleSelection}> 
            </div>
            <h1>{cardData.rank}</h1>
        </div>
    );
}

export default GalleryCard; 