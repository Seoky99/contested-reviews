import styles from "./Buttons.module.css";

function HideRatingsButton({showRatings, setShowRatings}) {
    return (
        <button className={styles.hideRatingsButton} onClick={() => setShowRatings(!showRatings)}>{showRatings?'Hide Ratings':'Show Ratings'}</button>);
}

function SaveButton({handleSaveClick}) {
    return (<button type="submit" onClick={handleSaveClick} className={styles.saveButton}>Save</button>);
}

function TagPanelButton({showPanel, setShowPanel}) {
    return (
        <button className={styles.addTagButton} onClick={() => setShowPanel(!showPanel)}>Manage Tags {showPanel ? `▲` : `▼`}</button>
    );
}

export { HideRatingsButton, SaveButton, TagPanelButton }; 