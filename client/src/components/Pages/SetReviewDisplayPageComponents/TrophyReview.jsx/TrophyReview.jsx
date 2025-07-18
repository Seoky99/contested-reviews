import styles from "./TrophyReview.module.css";

function TrophyReview({trophyData}) {

    const {trophy_id, review_id, user_set_id, name, description, card_name, image_normal } = trophyData; 

    return (
        <div className={styles.trophyReviewWrapper}>
            <img src={image_normal} width="180" height="250"></img>
            <h3>{name}</h3>
        </div>
    )

}

export default TrophyReview; 