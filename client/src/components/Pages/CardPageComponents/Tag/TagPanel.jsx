import { useState } from "react"; 
import styles from "./TagPanel.module.css";
import TagList from "./TagList";
import axiosPrivate from "../../../../customHooks/store/useAxiosPrivate";

function TagPanel({selectedTags, setSelectedTags, setTags, setSetTags, userSetId, toggleTag, handleDeleteTag}) {
    const [newTagName, setNewTagName] = useState('');
    const [tagCreationError, setTagCreationError] = useState(null);
    const noTags = setTags.length === 0; 

     async function handleCreatingTag() {
        try {
            const url = `tags`;
            const successTag = (await axiosPrivate.post(url, {tagName: newTagName, userSetId}, {
                headers: {'Content-Type': 'application/json'},
            })).data;

            successTag.tagCount = 1;

            const newSet = new Set(selectedTags); 
            newSet.add(successTag.tagId);

            setSelectedTags(newSet);
            setSetTags([...setTags, successTag]);

        } catch (err) {
            setTagCreationError('Failed to create tag');
            console.log(err); 
        }
    }

    return (
        <div className={`${styles.tagPanel} ${styles.slideIn}`}>
            {!noTags && <div>
                {/*<p className={styles.reminder}>Use Existing Tags:</p> */}
                <TagList setTags={setTags} handleDelete={handleDeleteTag} toggleTag={toggleTag} selectedTags={selectedTags}></TagList>
            </div>}
            <div className={styles.createTag}>
                <input className={styles.createInput} placeholder="Create new tag" type="text" value={newTagName}
                       onChange = {(e) => setNewTagName(e.target.value)}></input>
                <button className={styles.createTagButton} onClick={handleCreatingTag}>Submit</button>
                {tagCreationError && <p className={styles.tagError}>{tagCreationError}</p>}
            </div>
        </div>
    );
}

export default TagPanel;