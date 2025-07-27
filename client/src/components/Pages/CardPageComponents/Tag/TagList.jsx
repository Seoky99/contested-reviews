import Tag from "./Tag";
import styles from "./TagList.module.css";

function TagList({setTags, handleDelete, selectedTags, toggleTag, viewTaggedCards}) {
    
    const tagList = setTags.map(tag => {

        return <Tag key={tag.tagId} tag={tag} handleDelete={handleDelete} 
                    isSelected={selectedTags.has(tag.tagId)}
                    isManageMode={true} toggleTag={toggleTag}
                    viewTaggedCards={viewTaggedCards}/>
    });

    return (
        <div className={styles.tagContainer}>
            {tagList}
        </div>
    );
}

export default TagList;