import { useState } from 'react'; 
import useFetchSetInformation from '../../customHooks/useFetchSetInformation';
import SetReview from '../SetReview/SetReview';
import Set from "../Set/Set";
import AddPanel from '../AddPanel/AddPanel';
import styles from "./SetPage.module.css";

function SetPage({tempPageNav}) {

    const { sets, setReviews, loading, error } = useFetchSetInformation();
    const [selectedSetID, setSelectedSetID] = useState('d7beb4b7-e1ff-4d35-ab07-5700f17ea1ea');
    const [selectedSetReviewID, setSelectedSetReviewID] = useState(0);
    const [addView, setAddView] = useState(false);

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

    const displaySetReviews = setReviews.map(setReview => {
        return(
            <li key={setReview.user_set_id}>
                <SetReview handleSetReviewClick={handleSetReviewClick} setReviewData = {setReview} 
                selectedSetReviewID={selectedSetReviewID} tempPageNav={tempPageNav}></SetReview>
            </li>)
    }) 

    //TODO: Replace addView with routing 
    return (
        
        <div className={styles.pageWrapper}>

            <p>Available sets:</p>
            <ul className={styles.setWrapper}>{displaySets}</ul>

            {!addView && 
                <>
                    <p>My current sets:</p>
                    <ul className={styles.setReviewWrapper}>
                        <li>
                            <button onClick={() => setAddView(true)} className={styles.addSetButton}>
                                +
                            </button>
                        </li>
                        {displaySetReviews}
                    </ul>
                </>
            }

            {addView && <AddPanel currentImg={currentImg} selectedSetID={selectedSetID}></AddPanel>}
        </div>
    );
}; 

export default SetPage;