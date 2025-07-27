import styles from "./Buttons.module.css";

function HideRatingsButton({showRatings, setShowRatings}) {
    return (
        <button className={styles.hideRatingsButton} onClick={() => setShowRatings(!showRatings)}>{showRatings?'Hide Ratings':'Show Ratings'}</button>);
}

function SaveButton({handleSaveClick, saving}) {

    let message = 'Save'; 
    let errorStyle = ``;

    if (saving === 'error') {
        message = 'Error!'; 
        errorStyle = `${styles.errorSaving}`;
    } else if (saving === 'success') {
        message = 'Saved!';
    }

    return (<button type="submit" onClick={handleSaveClick} className={`${styles.saveButton} ${errorStyle}`}>{message}</button>);
}

function TagPanelButton({showPanel, setShowPanel, noTags}) {

    const label = noTags ? 'Add a Tag!' : 'Manage Tags';

    return (
        <button className={styles.addTagButton} onClick={() => setShowPanel(!showPanel)}>
            {label} <span>{showPanel ? `▲` : `▼`}</span>
        </button>
    );
}

export { HideRatingsButton, SaveButton, TagPanelButton }; 