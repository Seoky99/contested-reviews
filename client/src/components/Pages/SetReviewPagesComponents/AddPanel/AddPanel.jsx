import styles from "./AddPanel.module.css";
import SetReviewForm from "../SetReviewForm/SetReviewForm";

function AddPanel({selectedSet, selectedSetID}) {

    return (
    <div className={styles.addPanel}>
        <div className={styles.imageWrapper}>
            <img src={selectedSet.set_img} className={styles.image}></img>
        </div>
        <SetReviewForm selectedSetID={selectedSetID} name={selectedSet.name}/>
    </div>
    );
}

export default AddPanel; 