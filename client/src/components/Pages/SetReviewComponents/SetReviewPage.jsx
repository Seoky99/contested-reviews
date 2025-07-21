import { useState } from 'react'; 
import { Outlet } from "react-router";
import useFetchSetInformation from '../../../customHooks/useFetchSetInformation';
import Set from './Set/Set';
import SetReviewDisplay from './SetReview/SetReviewDisplay';
import styles from "./SetReviewPage.module.css";
import SetReviewList from './SetReview/SetReviewList';

function SetReviewPage() {

    const { sets, setReviews, setSetReviews, selectedSetID, setSelectedSetID, 
        selectedSetReviewID, setSelectedSetReviewID, loading, error } = useFetchSetInformation();
  
    const [selectedSet] = sets.filter(set => set.set_id === selectedSetID);
    const [selectedSetReview] = setReviews.filter(sr => sr.user_set_id === selectedSetReviewID);

    function handleSetClick(setID) {
        setSelectedSetID(setID);
    }

    function handleSetReviewClick(id) { 
        setSelectedSetReviewID(id);
    }

     async function deleteSetReview(userSetId) {
        //TODO: Create modal instead
        const confirmed = window.confirm("Are you sure you want to delete this?");

        if (!confirmed) {
            return;
        }

        const url = `http://localhost:8080/api/setreviews/${userSetId}`;
        try {
            const response = await fetch(url, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const newSetReviews = [...setReviews].filter(setReview => setReview.user_set_id !== userSetId); 
            setSetReviews(newSetReviews);

            if (newSetReviews.length > 0) {
                setSelectedSetReviewID(newSetReviews[0].user_set_id);
            } else {
                setSelectedSetReviewID(-1);
            }

        } catch (err) {
            console.log(err);
        }
    }

    console.log(setReviews);

    //Replace with user-friendly pages 
    if (error) { return <h1>Error!</h1>}; 
    if (loading) { return <h1>Loading!</h1>};


    const displaySets = sets.map(set => {
        return(
            <li key={set.set_id}>
                <Set handleSetClick={handleSetClick} setData={set}></Set>
            </li>);
    });

    return (
        
        <div className={styles.pageWrapper}>

            <Outlet className={styles.addScreen} context={{setReviews, setSetReviews, deleteSetReview, selectedSetReview, selectedSetReviewID, currentImg: selectedSet.set_img, selectedSetID}}/>

            <div className={styles.sideBar}>
                <p>Available Sets:</p>
                <ul className={styles.setWrapper}>{displaySets}</ul>
            </div>

            <SetReviewList setReviews={setReviews} setSetReviews={setSetReviews} handleSetReviewClick={handleSetReviewClick}
            selectedSetReviewID={selectedSetID}></SetReviewList>
        </div>
    );
}; 

export default SetReviewPage;