import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import styles from "./Trophy.module.css";
import { useState } from 'react'; 

function Trophy({trophyData}) {

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

    const { trophy_img_url, name } = trophyData; 

    return (
        <div className={styles.trophyWrapper}>
            <button className={styles.trophy} onMouseEnter={handleMouseOver} onMouseLeave={handleMouseOut}>
                <EmojiEventsIcon fontSize='large'/>
            </button>
            {isHovering && <p className={styles.absolute}>{name}</p>}
        </div>
    );
}

export default Trophy; 