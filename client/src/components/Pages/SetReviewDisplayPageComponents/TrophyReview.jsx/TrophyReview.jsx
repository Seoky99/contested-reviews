import styles from "./TrophyReview.module.css";

function TrophyReview({trophyData, isOpen}) {

    const {trophy_id, review_id, user_set_id, name, description, card_name, image_normal } = trophyData; 

    if (review_id === null) {
        return    (  
                    <div className={styles.trophyReviewWrapper}>
                        <div>
                            <h1>Not Assigned Yet</h1>
                        </div>
                        <h3 className={styles.label}>{name}</h3>
                    </div>
        );
    }

    return (
        <div className={styles.trophyReviewWrapper}>
            {!isOpen && 
                <>
                    <div>
                        <img className={styles.trophyReveal} src={"/reveal.png"} width="180" height="250"></img>
                    </div>
                    <h3 className={styles.label}>{name}</h3>
                </>
            }
            {isOpen &&
                <>
                    <div>
                        <img src={image_normal} width="180" height="250"></img>
                    </div>
                    <h3 className={styles.label}>{name}</h3>
                </> 
            }
        </div>
    )

}

export default TrophyReview; 