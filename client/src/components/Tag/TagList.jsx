import Tag from "./Tag";
import styles from "./TagList.module.css";

function TagList({setTags, handleDelete,selectedTags, toggleTag}) {
    
    const tagList = setTags.map(tag => {
        return <Tag key={tag.tagId} tagName={tag.tagName} handleDelete={() => handleDelete(tag.tagId)} 
                    tagId={tag.tagId} isSelected={selectedTags.has(tag.tagId)}
                    isManageMode={true} toggleTag={() => toggleTag(tag.tagId)}/>
    });

    return (
        <div className={styles.tagContainer}>
            {tagList}
        </div>
    );
}

export default TagList;