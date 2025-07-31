import { useState } from 'react';
import { useParams, useNavigate } from "react-router";
import styles from "./SetReviewViewPage.module.css";
import useFetchSetReview from "../../../customHooks/useFetchSetReview";
import TrophyReview from "./TrophyReview.jsx/TrophyReview";
import Dropdown from "./Dropdown/Dropdown";
import Present from "./Present/Present";
import TempColorRankingChart from "./Charts/ColorRankingChart";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function SetReviewDisplayPage({mode}) {

    const { userSetId, podId } = useParams();
    const navigate = useNavigate(); 

    const { setReviewData, trophies, setTrophies, openTrophyPresents, setOpenTrophyPresents, stats, loading, error } = useFetchSetReview(userSetId, mode, podId); 

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

    
    function navBack() {
        navigate("/setreviews");
    }
    
    return (
        <div className={styles.setReviewWrapper}>
            <button className={styles.navButton} onClick={navBack}><ArrowBackIcon fontSize="large"/></button>

            <h1>{mode === 'owner' ? setReviewData.name : 'Somebody Else'}</h1>
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