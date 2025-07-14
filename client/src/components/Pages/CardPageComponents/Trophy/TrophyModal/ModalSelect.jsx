import styles from "./ModalSelect.module.css";
import CardTrophy from "./CardTrophy";

function ModalSelect({displayStyle, trophy, handleTrophyClick}) {
    return (
        <div className={`${styles.trophy} ${displayStyle}`} key={trophy.trophy_id} onClick={() => handleTrophyClick(trophy.trophy_id)}>
            <CardTrophy/>
            {trophy.review_id !== null && <img src={trophy.image_normal} width="130" height="180"/>}
            <h3>{trophy.name}</h3>
        </div>
    );
}

export default ModalSelect; 