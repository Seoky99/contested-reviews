import SetReview from "./SetReview";
import styles from "./SetReviewList.module.css";
import { useOutletContext, Link } from "react-router";

function SetReviewList() {

    const { setReviews, setSetReviews, handleSetReviewClick, selectedSetReviewID } = useOutletContext();

    async function deleteSetReview(userSetId) {
        const url = `http://localhost:8080/api/setreviews/${userSetId}`;
        try {
            const response = await fetch(url, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const newSetReviews = [...setReviews].filter(setReview => setReview.user_set_id !== userSetId); 
            setSetReviews(newSetReviews);

        } catch (err) {
            console.log(err);
        }
    }

    const displaySetReviews = setReviews.map(setReview => {
        return(
            <li key={setReview.user_set_id}>
                <SetReview handleSetReviewClick={handleSetReviewClick} setReviewData={setReview} 
                selectedSetReviewID={selectedSetReviewID} deleteSetReview={() => deleteSetReview(setReview.user_set_id)}/>
            </li>)
    }) 

    return( 
        <>
            <p>My current sets: </p>
            <ul className={styles.setReviewWrapper}>
                <li>
                    <Link to="/setreviews/create" className={styles.addSet}>
                        +
                    </Link>
                </li>
                {displaySetReviews}
            </ul>
        </>
    );
}

export default SetReviewList; 