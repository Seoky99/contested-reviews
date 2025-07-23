import { useState } from "react"; 
import styles from "./TagPanel.module.css";
import TagList from "./TagList";

//delete tags if you can- check if setId
function TagPanel({selectedTags, setSelectedTags, setTags, setSetTags, userSetId, toggleTag}) {

    const [newTagName, setNewTagName] = useState('');
    const noTags = setTags.length === 0; 

     async function handleCreatingTag() {
        try {
            const url = `http://localhost:8080/api/tags`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }, 
                body: JSON.stringify({tagName: newTagName, userSetId}),
            });

            if (!response.ok) {
                throw new Error("server error" + response.status);
            }

            //use the server response to make the client obj
            const successTag = await response.json(); 
            const newSet = new Set(selectedTags); 
            newSet.add(successTag.tagId);

            setSelectedTags(newSet);
            setSetTags([...setTags, successTag]);

        } catch (err) {
            console.log(err); 
        }
    }

    async function handleDeleteTag(tagId) {
        try {
            const url = `http://localhost:8080/api/tags/${tagId}`;
            const response = await fetch(url, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error("server error" + response.status);
            }     
            setSetTags([...setTags].filter(tag => tag.tagId !== tagId));
            const newSet = new Set(selectedTags);
            newSet.delete(tagId);
            setSelectedTags(newSet);

        } catch (err) {
            console.log(err); 
        }
    }

    return (
        <div className={`${styles.tagPanel} ${styles.slideIn}`}>
            {!noTags && <div>
                <p className={styles.reminder}>Use Existing Tags From This Set!</p>
                <TagList setTags={setTags} handleDelete={handleDeleteTag} toggleTag={toggleTag} selectedTags={selectedTags}></TagList>
            </div>}
            <div className={styles.createTag}>
                <input className={styles.createInput} placeholder="Create new tag" type="text" value={newTagName}
                       onChange = {(e) => setNewTagName(e.target.value)}></input>
                <button className={styles.createTagButton} onClick={handleCreatingTag}>Submit</button>
            </div>
        </div>
    );
}

export default TagPanel;