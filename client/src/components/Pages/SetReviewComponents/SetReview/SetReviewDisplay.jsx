import styles from "./SetReviewDisplay.module.css";
import SetWidgets from "./SetWidgets";
import { useOutletContext } from "react-router";

function SetReviewDisplay() {

    const {selectedSetReviewID, selectedSetReview, deleteSetReview} = useOutletContext();

    const isPanel = selectedSetReviewID === -1;
    const fallbackImg = 'https://cards.scryfall.io/art_crop/front/d/d/dd125949-38c4-470f-9128-b80c45621086.jpg?1562442064';

    return (
            <div className={styles.setReviewSelect}>
                <div>
                    <img className={styles.image} src={isPanel ? fallbackImg : selectedSetReview.user_set_img}></img>
                </div>
                <div className={styles.infoPanel}>
                    <h1>{isPanel ? 'So Empty...' : selectedSetReview.name}</h1>
                    {!isPanel && <SetWidgets userSetId={selectedSetReviewID} deleteSetReview={() => deleteSetReview(selectedSetReviewID)}></SetWidgets>}
                </div>
            </div>
    );
}

export default SetReviewDisplay;