import styles from "./Notes.module.css"; 

function Notes({notesValue, handleNotesChange}) {
    return (
        <div className={styles.notes}>
            <label htmlFor="notes">Notes:</label>
            <textarea id="notes" name="notes" rows="4" cols="50" value={notesValue} onChange={handleNotesChange}>
            </textarea>
        </div>
    );

}

export default Notes; 