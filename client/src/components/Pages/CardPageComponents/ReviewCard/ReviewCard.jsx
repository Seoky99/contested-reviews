import styles from "./ReviewCard.module.css";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


function ReviewCard({imageUrl, rank, handleNavDirection, myIndex, total, showRatings}) {
    return (
            <div className={styles.cardRank}>
                <img className={styles.cardImage} src={imageUrl}></img>
                <h1>{showRatings && (rank === null ? "NR" : rank)}</h1> 
                <div className={styles.navButtonWrapper}>
                    <button className={styles.navButton} onClick={() => handleNavDirection("LEFT")}><ArrowBackIcon/></button> 
                    <h4>{myIndex+1}/{total}</h4>
                    <button className={styles.navButton} onClick={() => handleNavDirection("RIGHT")}><ArrowForwardIcon/></button>
                </div>
            </div>
    )

}

export default ReviewCard;