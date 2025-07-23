import styles from "./SetReviewForm.module.css";

function SetReviewForm({selectedSetID, createSetReview, name}) {
    return (
        <form className={styles.setReviewForm} onSubmit={createSetReview}>
            <h4>Selected Set: {name}</h4>
            <input hidden readOnly value={selectedSetID} name="setid" id="setid" type="text"></input>
            <div className={styles.formSeparator}>
                <label htmlFor="sr_name">Name your set review:</label>
                <input type="text" id="sr_name" name="sr_name"></input>
            </div>
            <div className={styles.formSeparator}>
                <label htmlFor="defaultApplied">Apply default ratings:</label>
                <input className={styles.checkBox} type="checkbox" id="defaultApplied" name="defaultApplied"></input>
            </div>
            <div className={styles.formSeparator}>
                <label htmlFor="bonusAdded">Include Bonus Sheet in Ratings:</label>
                <input className={styles.checkBox} type="checkbox" id="bonusAdded" name="bonusAdded"></input>
            </div>
            <div className={styles.formSeparator}>
                <label htmlFor="makeShard">Create a Shard!</label>
                <input className={styles.checkBox} type="checkbox" id="makeShard" name="makeShard"></input>
            </div>
            <button className={styles.submitButton} type="submit">Create Set Review!</button>
        </form>
    );
}

export default SetReviewForm;