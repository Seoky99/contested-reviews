import AddBoxIcon from '@mui/icons-material/AddBox';
import styles from "./Trophy.module.css";
import { useState } from 'react';

function AddTrophy({modalOnClick}) {

    const [isHovering, setIsHovering] = useState(false);

    function handleMouseOver(e) {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setIsHovering(true);
        }
    }

    function handleMouseOut(e) {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setIsHovering(false);
        }
    }

    return (
        <div className={styles.addTrophyWrapper}>
            <button className={styles.addTrophy} onClick={modalOnClick} onMouseEnter={handleMouseOver} onMouseLeave={handleMouseOut}>
                <AddBoxIcon fontSize='large'/>
            </button>
            {isHovering && <p className={styles.absolute}>Add Trophy!</p>}
        </div>
    );
}

export default AddTrophy; 