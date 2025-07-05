import { useState, useEffect } from 'react'; 
import SetReview from './SetReview';
import Set from "./Set";

function SetPage() {

    const [sets, setSets] = useState([]);
    const [setReviews, setSetReviews] = useState([]);
    const [selectedSetID, setSelectedSetID] = useState('d7beb4b7-e1ff-4d35-ab07-5700f17ea1ea');
    const [selectedSetReviewID, setSelectedSetReviewID] = useState(0);

    const [addView, setAddView] = useState(false);

    const [loading, setLoading] = useState(true);

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
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
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

    function findCorrespondingImg(setID) {
        return sets.find(set => setID === set.set_id);
    }

    if (loading) { return <h1>Loading!</h1>};

    const currentImg = findCorrespondingImg(selectedSetID).set_img; 
    

    const displaySets = sets.map(set => {
        const { set_id, set_code, set_img } = set;
        return(
            <li key={set_id}>
                <Set handleClick={handleClick} set_id={set_id} set_code={set_code} 
                set_img={set_img}>{set_code.toUpperCase()}</Set>
            </li>);
    });

    const displaySetReviews = setReviews.map(setReview => {
        const { set_review_name, user_set_id, user_set_img } = setReview;
        return(
            <li key={user_set_id}>
                <SetReview handleClick={handleSetReviewClick} set_review_name={set_review_name} 
                user_set_img={user_set_img} user_set_id={user_set_id} selectedSetReviewID={selectedSetReviewID}></SetReview>
            </li>)
    }) 


    return (
        
        <div className="setWrapper">

            <p>Available sets:</p>
            <ul>{displaySets}</ul>

            {!addView && 
                <>
                <p>My current sets:</p>
                <ul>
                    <li><button onClick={() => setAddView(true)} className="addSetButton">+</button></li>
                    {displaySetReviews}
                </ul>
                </>
            }

            {addView && 
                <div className="add-panel">
                    <img src={currentImg}></img>
                    <form action="http://localhost:8080/api/setreviews/create" method="post">
                        <input hidden readOnly value={selectedSetID} name="setid" id="setid" type="text"></input>
                        <div className="form-separator">
                            <label htmlFor="name">Name your set review:</label>
                            <input type="text" id="name" name="name"></input>
                        </div>
                        <div className="form-separator">
                            <label htmlFor="defaultApplied">Apply default ratings:</label>
                            <input type="checkbox" id="defaultApplied" name="defaultApplied"></input>
                        </div>
                        <div className="form-separator">
                            <label htmlFor="bonusAdded">Include Bonus Sheet in Ratings:</label>
                            <input type="checkbox" id="bonusAdded" name="bonusAdded"></input>
                        </div>
                        {/*<label for="set-review-profile">Choose image for set review *Under Construction</label>*/}
                        <button type="submit">Create the set!</button>
                    </form>
                </div>
            }

            <p>Selected set: {selectedSetID}</p>
        </div>
    );
}; 

export default SetPage;