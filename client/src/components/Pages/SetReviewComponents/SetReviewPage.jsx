import { useState } from 'react'; 
import useFetchSetInformation from '../../../customHooks/useFetchSetInformation';
import { Outlet } from "react-router";
import Set from './Set/Set';
import styles from "./SetReviewPage.module.css";

function SetReviewPage() {

    const { sets, setSetReviews, setReviews, loading, error } = useFetchSetInformation();
    const [selectedSetID, setSelectedSetID] = useState('452951cf-378b-4472-b7fe-572fe2af2ac0');
    const [selectedSetReviewID, setSelectedSetReviewID] = useState(0);

    function handleSetClick(setID) {
        setSelectedSetID(setID);
    }

    function handleSetReviewClick(id) { 
        selectedSetReviewID === id ? setSelectedSetReviewID(0) : setSelectedSetReviewID(id);
    }

    function findCorrespondingImg(setID) {
        return sets.find(set => setID === set.set_id);
    }

    //Replace with user-friendly pages 
    if (error) { return <h1>Error!</h1>}; 
    if (loading) { return <h1>Loading!</h1>};

    const currentImg = findCorrespondingImg(selectedSetID).set_img; 

    const displaySets = sets.map(set => {
        return(
            <li key={set.set_id}>
                <Set handleSetClick={handleSetClick} setData={set}></Set>
            </li>);
    });

    return (
        
        <div className={styles.pageWrapper}>

            <p>Available sets:</p>
            <ul className={styles.setWrapper}>{displaySets}</ul>

            <Outlet context={{setReviews, setSetReviews, handleSetReviewClick, selectedSetReviewID, currentImg, selectedSetID}}/>
        </div>
    );
}; 

export default SetReviewPage;