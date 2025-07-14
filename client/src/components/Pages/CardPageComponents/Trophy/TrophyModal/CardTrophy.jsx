import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import styles from "../TrophyDisplay/Trophy.module.css";

function CardTrophy() {
    return (
        <button className={styles.trophy}>
            <EmojiEventsIcon fontSize='large'/>
        </button>
    );
}

export default CardTrophy; 