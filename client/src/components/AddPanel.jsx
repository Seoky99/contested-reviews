function AddPanel({currentImg, selectedSetID}) {

    return (
    <div className="add-panel">
        <img src={currentImg}></img>
        <form action="http://localhost:8080/api/setreviews/" method="post">
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
    );
}

export default AddPanel; 