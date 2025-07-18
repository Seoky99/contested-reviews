import styles from "./SetReviewDisplayPage.module.css";
import { useParams } from "react-router";
import useFetchSetReview from "../../../customHooks/useFetchSetReview";
import TrophyReview from "./TrophyReview.jsx/TrophyReview";

function SetReviewDisplayPage() {

    const { userSetId } = useParams();
    console.log(userSetId);
    const { trophies, setTrophies, loading, error } = useFetchSetReview(userSetId); 

    if (loading) { return <h1>Loading!</h1>};
    if (error) { return <h1>Error!</h1>};

    console.log(trophies);

    const trophyList = trophies.map(trophy => {
        return <TrophyReview key={trophy.trophy_id} trophyData={trophy}/>
    })

    return (
        <div className={styles.setReviewWrapper}>
            <h1>SETREVIEW NAME</h1>
            <div className={styles.bannerWrapper}>
                <img></img>
                <h1></h1>
            </div>
            <div className={styles.statWrapper}>
                <h1>My Stats</h1>
            </div>
            <div className={styles.trophyWrapper}>
                <h1>My Trophies</h1>
                <div className={styles.trophyListWrapper}>
                    { trophyList }
                </div>
            </div>
        </div>
    );

}

export default SetReviewDisplayPage;