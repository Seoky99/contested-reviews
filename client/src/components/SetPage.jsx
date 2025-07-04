import { useState, useEffect } from 'react'; 
import SetReview from './SetReview';
import Set from "./Set";

function SetPage() {

    const [sets, setSets] = useState([]);
    const [setReviews, setSetReviews] = useState([]);
    const [selectedSetID, setSelectedSetID] = useState('');
    const [selectedSetReviewID, setSelectedSetReviewID] = useState(0);
    //const [loading, setLoading] = useState(true);

    useEffect( () => {

        async function fetchPageInformation() {

                const urls = [
                    'http://localhost:8080/api/sets',
                    'http://localhost:8080/api/setreviews'
                ];

            try {
                const responses = await Promise.all(urls.map(url => fetch(url)));
                const [setData, setReviewData] = await Promise.all(responses.map(response => response.json()));
                setSets(setData); 
                setSetReviews(setReviewData);
                console.log(setData);
                console.log(setReviewData);
            } catch (err) {
                console.log(err);
            } finally {
                //setLoading(false);
            }
        } 
        fetchPageInformation(); 
    }, []); 

    function handleClick(setID) {
        setSelectedSetID(setID);
    }

    function handleSetReviewClick(id) {
        setSelectedSetReviewID(id);
    }

    const displaySets = sets.map(set => {
        const { set_id, set_code, set_img } = set;
        return(
            <li key={set_id}>
                <Set handleClick={handleClick} set_id={set_id} set_code={set_code} 
                set_img={set_img}>{set_code.toUpperCase()}</Set>
            </li>);
    });

    const displaySetReviews = setReviews.map(setReview => {
        const { set_review_name, set_code, set_name, user_set_id, user_set_img } = setReview;
        return(
            <li key={user_set_id}>
                <SetReview handleClick={handleSetReviewClick} set_review_name={set_review_name} set_code={set_code} 
                set_name={set_name} user_set_img={user_set_img} user_set_id={user_set_id} selectedSetReviewID={selectedSetReviewID}></SetReview>
            </li>)
    }) 


    return (
        
        <div className="setWrapper">

            <p>Available sets:</p>
            <ul>{displaySets}</ul>

            <p>My current sets:</p>
            <ul>
                <li><button>Add a set:</button></li>
                {displaySetReviews}
            </ul>

            <p>Selected set: {selectedSetID}</p>
        </div>
    );
}; 

export default SetPage;