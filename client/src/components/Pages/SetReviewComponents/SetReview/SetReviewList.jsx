import SetReview from "./SetReview";
import styles from "./SetReviewList.module.css";
import { useOutletContext, Link } from "react-router";
import AddBoxIcon from '@mui/icons-material/AddBox';

function SetReviewList({setReviews, setSetReviews, handleSetReviewClick, selectedSetReviewID}) {

    /*const { setReviews, setSetReviews, handleSetReviewClick, selectedSetReviewID } = useOutletContext(); */

    const displaySetReviews = setReviews.map(setReview => {
        return(
            <li key={setReview.user_set_id}>
                <SetReview handleSetReviewClick={handleSetReviewClick} setReviewData={setReview} 
                selectedSetReviewID={selectedSetReviewID}/>
            </li>)
    }) 

    return( 

        <div className={styles.setReviewWrapper}>
            <p className={styles.srLabel}>My Set Reviews:</p>
            <ul className={styles.setReviews}>
                <li>
                    <Link to="/setreviews/create" className={styles.addSet}>
                        <AddBoxIcon fontSize="large" className={styles.iconPos}/>
                    </Link>
                    <p className={styles.label}>Create Set Review!</p>
                </li>
                {displaySetReviews}
            </ul>
        </div>
    );
}

export default SetReviewList; 