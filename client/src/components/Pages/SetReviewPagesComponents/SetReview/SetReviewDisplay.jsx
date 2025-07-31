import styles from "./SetReviewDisplay.module.css";
import SetWidgets from "./SetWidgets";

function SetReviewDisplay({selectedSetReviewID, selectedSetReview, deleteSetReview, lockInSetReview, unlockSetReview}) {
    
    const fallbackImg = 'https://cards.scryfall.io/art_crop/front/5/a/5a5841fa-4f30-495a-b840-3ef5a2af8fad.jpg?1711812497';

    if (selectedSetReviewID === -1) {
        return  <div className={styles.setReviewSelect}>
                    <img src={fallbackImg} className={styles.image}></img>
                    <div className={styles.fallback}>
                        <h1>So empty...</h1>
                        <p>Create a set review below!</p>
                    </div>
                </div>;
    } 

    const { name, set_name, includes_bonus, pod_ids } = selectedSetReview;

    return (
            <div className={styles.setReviewSelect}>
                <div className={styles.imgContainer}>
                    <img className={styles.image} src={selectedSetReview.user_set_img}></img>
                </div>
                <div className={styles.infoPanel}>
                    <h1 className={styles.title}>{name}</h1>
                    <p>{set_name} {includes_bonus && `(Includes Bonus Sheet!)`}</p>
                    <SetWidgets podIds={pod_ids} userSetId={selectedSetReviewID} deleteSetReview={() => deleteSetReview(selectedSetReviewID)}
                                lockInSetReview={() => lockInSetReview(selectedSetReviewID)}
                                unlockSetReview={() => unlockSetReview(selectedSetReviewID)}></SetWidgets>
                </div>
            </div>
    );
}

export default SetReviewDisplay;