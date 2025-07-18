import Trophy from "./Trophy";
import AddTrophy from "./AddTrophy";
import styles from "./TrophyDisplay.module.css";

function TrophyDisplay({displayTrophies, modalOnClick}) {
    const trophies = displayTrophies.map(trophy => {
        return <Trophy key={trophy.trophy_id} trophyData={trophy}></Trophy>
    }) 

    return (
        <div className={styles.displayWrapper}>
            {trophies}
            <AddTrophy modalOnClick={modalOnClick}></AddTrophy>
        </div>
    )
}

export default TrophyDisplay;