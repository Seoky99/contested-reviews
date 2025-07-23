import { Link } from "react-router";
import styles from "./ReviewCard.module.css";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


function ReviewCard({imageUrl, rank, prevUrl, nextUrl, myIndex, total, showRatings}) {
    return (
            <div className={styles.cardRank}>
                <img className={styles.cardImage} src={imageUrl}></img>
                <h1>{showRatings && (rank === null ? "NR" : rank)}</h1> 
                <div className={styles.navButtonWrapper}>
                    <Link to={prevUrl} className={styles.navButton}><ArrowBackIcon/></Link> 
                    <h4>{myIndex+1}/{total}</h4>
                    <Link to={nextUrl} className={styles.navButton}><ArrowForwardIcon/></Link>
                </div>
            </div>
    )

}

export default ReviewCard;