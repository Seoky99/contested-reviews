import Tag from "./Tag";
import styles from "./ReviewTagList.module.css";

function TagList({reviewTags, handleDelete, selectedTags, toggleTag, reviewId, showPanel, viewTaggedCards}) {

    const tagsDisplay =  
        reviewTags.map(tag => {
            return <Tag key={tag.tagId} tag={tag} handleDelete={handleDelete} isSelected={selectedTags.has(tag.tagId)}
            isManageMode={showPanel} toggleTag={() => toggleTag(tag.tagId)} viewTaggedCards={() => viewTaggedCards(tag.tagId)}></Tag>
        })

    return (
        <div className={styles.tagContainer}>
            {tagsDisplay}
        </div>
    );
}

export default TagList;