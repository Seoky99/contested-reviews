import styles from "./Tag.module.css";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

//manage mode: if clicked, swap 
function Tag({tagName, handleDelete, toggleTag, viewTaggedCards, tagId, isSelected, isManageMode}) {

    const onClickHandler = isManageMode ? toggleTag : viewTaggedCards; 
    const selectStyle = isSelected && isManageMode ? styles.isSelected : ``;

    return (
        <>
            <div className={`${styles.tagStyles} ${selectStyle}`} onClick={onClickHandler}>
                <p>{tagName}</p>
                <div className={styles.tagButtons}>
                    { isManageMode && 
                        <>
                            <button onClick={() => console.log("implement editing!")}><EditIcon className={styles.icon}/></button>
                            <button onClick={handleDelete}><DeleteIcon className={styles.icon}/></button>
                        </>
                     }
                </div>
            </div>
        </>
    )
}

export default Tag; 