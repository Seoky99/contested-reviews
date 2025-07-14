import styles from "./SetReviewPage.module.css";

function SetReviewPage({}) {

    return (
        <div className={styles.setReviewWrapper}>
            <h1>SETREVIEW NAME</h1>
            <div className={styles.bannerWrapper}>
                <img></img>
                <h1></h1>
            </div>
            <div className={styles.statWrapper}>
                <h1>stats go here</h1>
            </div>
            <div className={styles.trophyWrapper}>
                <h1>Trophies Go here</h1>
            </div>
        </div>
    );

}

export default SetReviewPage;