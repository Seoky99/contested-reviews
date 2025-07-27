import styles from "./Tag.module.css";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
/**
 * 
 * @param {Object} props
 * @param {boolean} props.isManageMode - If tag is in manageMode, users can edit and delete set-specific tags through the tag
 * @param {boolean} props.isSelected - The tag is now associated with this review.                                                     
 * @returns 
 */
function Tag({tag, handleDelete, toggleTag, viewTaggedCards, isSelected, isManageMode}) {

    const {tagCount, tagName, tagId} = tag;
    /*const onClickHandler = isManageMode ? toggleTag : viewTaggedCards; */
    const selectStyle = isSelected && isManageMode ? styles.isSelected : ``;
    const toggleOnManage = isManageMode ? toggleTag : undefined; 

    function viewStopProp(e) {
        e.stopPropagation();
        viewTaggedCards(tagId);  
    }

    function deleteStopProp(e) {
        e.stopPropagation(); 
        handleDelete(tagId);
    }

    return (
            <div className={`${styles.tagStyles} ${selectStyle}`} onClick={() => toggleOnManage(tagId)}>
                <p>{tagName} <span><i>({tagCount})</i></span></p>
                <div className={styles.tagButtons}>
                    <button onClick={viewStopProp}> <VisibilityIcon fontSize="small"/></button>
                    { isManageMode &&
                        <>
                            {/*<button onClick={() => console.log("implement editing!")}><EditIcon className={styles.icon}/></button> */}
                            <button onClick={deleteStopProp}><DeleteIcon className={styles.icon}/></button>
                        </>
                    }
                </div>
            </div>
    )
}

export default Tag; 