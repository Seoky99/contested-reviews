import styles from "./SetReviewDisplayPage.module.css";
import { useState } from 'react';
import { useParams } from "react-router";
import useFetchSetReview from "../../../customHooks/useFetchSetReview";
import TrophyReview from "./TrophyReview.jsx/TrophyReview";
import Dropdown from "./Dropdown/Dropdown";
import Present from "./Present/Present";
import TempColorRankingChart from "./Charts/ColorRankingChart";

function SetReviewDisplayPage() {

    const { userSetId } = useParams();
    console.log(userSetId);
    const { trophies, setTrophies, openTrophyPresents, setOpenTrophyPresents, stats, loading, error } = useFetchSetReview(userSetId); 

    const [ statsOpen, setStatsOpen ] = useState(false);
    const [ trophyOpen, setTrophyOpen ] = useState(false);

    if (loading) { return <h1>Loading!</h1>};
    if (error) { return <h1>Error!</h1>};

    function openPresent(i) {
        const newPresents = [...openTrophyPresents]; 
        newPresents[i] = true; 

        setOpenTrophyPresents(newPresents);
    }

    function revealAllPresents() {
        const newPresents = Array(openTrophyPresents.length).fill(true);
        setOpenTrophyPresents(newPresents);
    }

    const trophyPresentList = trophies.map( (trophy, i) => {
        return <Present key={trophy.trophy_id} isOpen={openTrophyPresents[i]} setIsOpen={() => openPresent(i)}>
                    <TrophyReview trophyData={trophy} isOpen={openTrophyPresents[i]}/>
               </Present>
    });

    console.log(stats);

    return (
        <div className={styles.setReviewWrapper}>
            <h1>SETREVIEW NAME</h1>
            <div className={styles.bannerWrapper}>
                <img></img>
                <h1></h1>
            </div>
            <Dropdown header={"My Stats"} isOpen={statsOpen} setIsOpen={setStatsOpen}>
                <TempColorRankingChart averages={stats}></TempColorRankingChart>
            </Dropdown>
            <Dropdown header={"My Trophies"} isOpen={trophyOpen} setIsOpen={setTrophyOpen}>
                <>
                    <button onClick={revealAllPresents}>Reveal All!</button>
                    <div className={styles.trophyListWrapper}>
                        { trophyPresentList }
                    </div>
                </>
            </Dropdown>
        </div>
    );

}

export default SetReviewDisplayPage;