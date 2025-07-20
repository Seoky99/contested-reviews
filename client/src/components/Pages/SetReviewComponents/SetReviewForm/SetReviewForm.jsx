import styles from "./SetReviewForm.module.css";

function SetReviewForm({selectedSetID, createSetReview}) {
    return (
        <form className={styles.setReviewForm} onSubmit={createSetReview}>
            <input hidden readOnly value={selectedSetID} name="setid" id="setid" type="text"></input>
            <div className={styles.formSeparator}>
                <label htmlFor="sr_name">Name your set review:</label>
                <input type="text" id="sr_name" name="sr_name"></input>
            </div>
            <div className={styles.formSeparator}>
                <label htmlFor="defaultApplied">Apply default ratings:</label>
                <input type="checkbox" id="defaultApplied" name="defaultApplied"></input>
            </div>
            <div className={styles.formSeparator}>
                <label htmlFor="bonusAdded">Include Bonus Sheet in Ratings:</label>
                <input type="checkbox" id="bonusAdded" name="bonusAdded"></input>
            </div>
            <div className={styles.formSeparator}>
                <label htmlFor="makeShard">Create a Shard!</label>
                <input type="checkbox" id="makeShard" name="makeShard"></input>
            </div>
            {/*<label for="set-review-profile">Choose image for set review *Under Construction</label>*/}
            <button className={styles.submitButton} type="submit">Create the set!</button>
        </form>
    );
}

export default SetReviewForm;