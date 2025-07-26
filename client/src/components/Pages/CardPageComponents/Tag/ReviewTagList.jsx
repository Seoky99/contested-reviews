import Tag from "./Tag";
import styles from "./ReviewTagList.module.css";

function TagList({reviewTags, handleDelete, selectedTags, toggleTag, reviewId, showPanel}) {
    
    const tagsDisplay =  
        reviewTags.map(tag => {
            return <Tag key={tag.tagId} tagName={tag.tagName}
            tagId={tag.tagId} handleDelete={() => handleDelete(reviewId, tag.tagId)} isSelected={selectedTags.has(tag.tagId)}
            isManageMode={showPanel} toggleTag={() => toggleTag(tag.tagId)} viewTaggedCards={() => console.log("Implement me!")}></Tag>
        })

    return (
        <div className={styles.tagContainer}>
            {tagsDisplay}
        </div>
    );
}

export default TagList;