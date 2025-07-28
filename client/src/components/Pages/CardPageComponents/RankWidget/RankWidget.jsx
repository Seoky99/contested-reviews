import { useState } from "react"; 
import LetterButton from "./LetterButton";
import styles from "./RankWidget.module.css";
import ModifierButton from "./ModifierButton";

function RankWidget({rank, handleRankChange}) {

    function parseRank(str) {
        if (str === "NR") { return { base: "NR", modifier: null }}

        const base = str.charAt(0); 
        const modifier = str.length >= 1 ? str.charAt(1) : null; 
        return { base, modifier };
    }

    const { base, modifier } = parseRank(rank);

    function handleLetterButton(newBase) {
        handleRankChange(newBase + (modifier === null ? `` : `${modifier}`));
    }

    function handleModifierButton(newModifier) {

        if (base === 'NR') {
            return; 
        }

        if (newModifier === modifier) {
            newModifier = null; 
        }     

        handleRankChange(base + (newModifier === null ? `` : newModifier));
    }

    const AVAILABLE_RANKS = [ 'A', 'B', 'C', 'D', 'F']; 
    const displayButtons = AVAILABLE_RANKS.map(availableRank => {
        return <LetterButton key={availableRank} displayRank={availableRank} base={base} handleClick={() => handleLetterButton(availableRank)}/>
    })

    return (
            <div className={styles.buttonContainer /*styles.alternate */}>
                {
                    displayButtons
                }
                <div className={styles.modifierButtons}>
                    <ModifierButton handleClick={() => handleModifierButton("+")} displayModifier={"+"} modifier={modifier}/>
                    <ModifierButton handleClick={() => handleModifierButton("-")} displayModifier={"-"} modifier={modifier}/>
                </div>
            </div>
            
    );
}

export default RankWidget;