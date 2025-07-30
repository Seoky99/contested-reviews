import styles from "./SetReviewPage.module.css";
import useFetchSetReviewInfo from "../../../customHooks/useFetchSetReviewInfo";
import SetReviewList from './SetReview/SetReviewList';
import SetReviewDisplay from "./SetReview/SetReviewDisplay";
import axiosPrivate from "../../../customHooks/store/useAxiosPrivate";

function SetReviewPage() {

    const { setReviews, setSetReviews, selectedSetReviewID, setSelectedSetReviewID, loading, error } = useFetchSetReviewInfo();

    function handleSetReviewClick(id) { 
        setSelectedSetReviewID(id);
    }

     async function deleteSetReview(userSetId) {
        //TODO: Create modal instead
        const confirmed = window.confirm("Are you sure you want to delete this?");

        if (!confirmed) { return; }

        const url = `setreviews/${userSetId}`;

        try {
            await axiosPrivate.delete(url);
        
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

    async function lockInSetReview(userSetId) {
        //TODO: Create modal instead
        const confirmed = window.confirm("Are you sure you want to lock in this set review to this pod?");

        if (!confirmed) { return; }

        const url = `setreviews/${userSetId}/pods`;

        try {
            
            //HARDCODED FOR GLOBAL POD ONLY, CHANGE TO USER CHOOSING PANEL LATER
            await axiosPrivate.post(url, {podIds: [1]});

            const srCopy = [...setReviews];
            const transformed = srCopy.map(setReview => {
                if (setReview.user_set_id === userSetId) {
                    return {...setReview, pod_id: 1}
                } else {
                    return setReview;
                }
            })
            
            setSetReviews(transformed);

        } catch (err) {
            console.log(err);
        }
    }

    //Replace with user-friendly pages 
    if (error) { return <h1>Error!</h1>}; 
    if (loading) { return <h1>Loading!</h1>};

    const [selectedSetReview] = setReviews.filter(sr => sr.user_set_id === selectedSetReviewID);

    return (
        <div className={styles.pageWrapper}>
            <SetReviewDisplay selectedSetReviewID={selectedSetReviewID} selectedSetReview={selectedSetReview} deleteSetReview={deleteSetReview}
                              lockInSetReview={lockInSetReview}/>
            <SetReviewList setReviews={setReviews} setSetReviews={setSetReviews} handleSetReviewClick={handleSetReviewClick}
                           selectedSetReviewID={selectedSetReviewID}/>
        </div>
    ); 
}; 

export default SetReviewPage;